import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";

// A throwaway SQLite database per run, so tests never touch the dev database.
// Set DATABASE_URL before any module that constructs a Prisma client is loaded.
const dir = mkdtempSync(path.join(tmpdir(), "dsp-profile-"));
process.env.DATABASE_URL = `file:${path.join(dir, "test.db")}`;

// Create the schema in the throwaway database before Prisma connects.
execSync("npx prisma db push --skip-generate", {
  stdio: "ignore",
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
});

// Mock next/headers so getSessionUserId() reads a signed session cookie.
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (name: string) =>
      name === "dsp_session" ? { value: "user-1" } : undefined,
  }),
}));

// Mock the session verification so the token resolves to our seeded user.
// The id is assigned after seeding, so read it from a mutable holder.
const session = { userId: "" };
vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    getSessionUserId: async () => session.userId,
  };
});

type PrismaClient = import("@prisma/client").PrismaClient;
let prisma: PrismaClient;
let getProfile: () => Promise<Response>;
let putProfile: (req: Request) => Promise<Response>;
let postFavorite: (req: Request, ctx: { params: { id: string } }) => Promise<Response>;
let deleteFavorite: (req: Request, ctx: { params: { id: string } }) => Promise<Response>;
let postSchedule: (req: Request, ctx: { params: { id: string } }) => Promise<Response>;
let deleteSchedule: (req: Request, ctx: { params: { id: string } }) => Promise<Response>;

let userId: string;
let tutorialId: string;

beforeAll(async () => {
  // Dynamic imports so Prisma is constructed after DATABASE_URL is set.
  const db = await import("@/lib/db");
  prisma = db.prisma;

  const profileRoute = await import("./route");
  getProfile = profileRoute.GET;
  putProfile = profileRoute.PUT;

  const favoritesRoute = await import("../favorites/[id]/route");
  postFavorite = favoritesRoute.POST;
  deleteFavorite = favoritesRoute.DELETE;

  const scheduleRoute = await import("../schedule/[id]/route");
  postSchedule = scheduleRoute.POST;
  deleteSchedule = scheduleRoute.DELETE;

  const user = await prisma.user.create({
    data: {
      name: "Dancer",
      email: "dancer@example.com",
      passwordHash: "hash",
      level: "Beginner",
    },
  });
  userId = user.id;
  session.userId = user.id;

  const tutorial = await prisma.tutorial.create({
    data: {
      title: "Hip-Hop Basics",
      category: "Hip-Hop",
      level: "Beginner",
      videoPath: "/videos/hiphop.mp4",
      steps: JSON.stringify(["Step 1", "Step 2"]),
    },
  });
  tutorialId = tutorial.id;
});

afterAll(async () => {
  await prisma.$disconnect();
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // Windows may still hold the SQLite file open; cleanup is best-effort.
  }
});

describe("GET /api/profile", () => {
  it("returns the user's name and level", async () => {
    const res = await getProfile();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Dancer");
    expect(body.level).toBe("Beginner");
  });

  it("returns empty favorites and schedule for a new user", async () => {
    const res = await getProfile();
    const body = await res.json();
    expect(body.favorites).toEqual([]);
    expect(body.schedule).toEqual([]);
  });
});

describe("PUT /api/profile", () => {
  it("saves a new level", async () => {
    const res = await putProfile(
      new Request("http://localhost/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: "Advanced" }),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.level).toBe("Advanced");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.level).toBe("Advanced");
  });

  it("rejects an invalid level", async () => {
    const res = await putProfile(
      new Request("http://localhost/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: "Expert" }),
      }),
    );
    expect(res.status).toBe(400);
  });
});

describe("favorites", () => {
  it("adds a tutorial to favorites", async () => {
    const res = await postFavorite(
      new Request("http://localhost/api/favorites/" + tutorialId, {
        method: "POST",
      }),
      { params: { id: tutorialId } },
    );
    expect(res.status).toBe(200);

    const favorite = await prisma.favorite.findUnique({
      where: { userId_tutorialId: { userId, tutorialId } },
    });
    expect(favorite).not.toBeNull();
  });

  it("shows the favorite in the profile", async () => {
    const res = await getProfile();
    const body = await res.json();
    expect(body.favorites).toHaveLength(1);
    expect(body.favorites[0].tutorialId).toBe(tutorialId);
    expect(body.favorites[0].title).toBe("Hip-Hop Basics");
  });

  it("removes a tutorial from favorites", async () => {
    const res = await deleteFavorite(
      new Request("http://localhost/api/favorites/" + tutorialId, {
        method: "DELETE",
      }),
      { params: { id: tutorialId } },
    );
    expect(res.status).toBe(200);

    const favorite = await prisma.favorite.findUnique({
      where: { userId_tutorialId: { userId, tutorialId } },
    });
    expect(favorite).toBeNull();
  });
});

describe("schedule", () => {
  it("adds a practice session with a date and time", async () => {
    const scheduledAt = "2026-11-01T10:00:00.000Z";
    const res = await postSchedule(
      new Request("http://localhost/api/schedule/" + tutorialId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt }),
      }),
      { params: { id: tutorialId } },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.scheduledAt).toBe(scheduledAt);

    const entry = await prisma.scheduleEntry.findFirst({
      where: { userId, tutorialId },
    });
    expect(entry).not.toBeNull();
  });

  it("shows the schedule in the profile", async () => {
    const res = await getProfile();
    const body = await res.json();
    expect(body.schedule).toHaveLength(1);
    expect(body.schedule[0].tutorialId).toBe(tutorialId);
  });

  it("removes a practice session from the schedule", async () => {
    const entry = await prisma.scheduleEntry.findFirst({
      where: { userId, tutorialId },
    });
    expect(entry).not.toBeNull();

    const res = await deleteSchedule(
      new Request("http://localhost/api/schedule/" + entry!.id, {
        method: "DELETE",
      }),
      { params: { id: entry!.id } },
    );
    expect(res.status).toBe(200);

    const remaining = await prisma.scheduleEntry.findFirst({
      where: { userId, tutorialId },
    });
    expect(remaining).toBeNull();
  });
});
