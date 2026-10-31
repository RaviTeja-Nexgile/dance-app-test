import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";

// A throwaway SQLite database per run, so tests never touch the dev database.
// Set DATABASE_URL before any module that constructs a Prisma client is loaded.
const dir = mkdtempSync(path.join(tmpdir(), "dsp-achievements-"));
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
let getAchievements: () => Promise<Response>;

let userId: string;

beforeAll(async () => {
  // Dynamic imports so Prisma is constructed after DATABASE_URL is set.
  const db = await import("@/lib/db");
  prisma = db.prisma;

  const route = await import("./route");
  getAchievements = route.GET;

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
});

afterAll(async () => {
  await prisma.$disconnect();
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // Windows may still hold the SQLite file open; cleanup is best-effort.
  }
});

describe("GET /api/achievements", () => {
  it("returns an empty list for a new user", async () => {
    const res = await getAchievements();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.achievements).toEqual([]);
  });

  it("does not award an achievement below 10 completions", async () => {
    // Seed 9 completions for the user.
    const tutorials = await prisma.tutorial.createMany({
      data: Array.from({ length: 9 }, (_, i) => ({
        title: `Tutorial ${i}`,
        category: "Hip-Hop",
        level: "Beginner",
        videoPath: `/videos/${i}.mp4`,
        steps: JSON.stringify(["Step"]),
      })),
    });
    expect(tutorials.count).toBe(9);

    const created = await prisma.tutorial.findMany({
      orderBy: { title: "asc" },
      take: 9,
    });
    await prisma.completion.createMany({
      data: created.map((t) => ({ userId, tutorialId: t.id })),
    });

    const res = await getAchievements();
    const body = await res.json();
    expect(body.achievements).toEqual([]);
  });

  it("awards the '10 Tutorials' achievement at 10 completions", async () => {
    // Add a 10th completion.
    const tenth = await prisma.tutorial.create({
      data: {
        title: "Tutorial 10",
        category: "Hip-Hop",
        level: "Beginner",
        videoPath: "/videos/10.mp4",
        steps: JSON.stringify(["Step"]),
      },
    });
    await prisma.completion.create({
      data: { userId, tutorialId: tenth.id },
    });

    const res = await getAchievements();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.achievements).toHaveLength(1);
    expect(body.achievements[0].name).toBe("10 Tutorials");
    expect(body.achievements[0].earnedAt).toBeTruthy();
  });

  it("does not duplicate the achievement on repeated reads", async () => {
    await getAchievements();
    const res = await getAchievements();
    const body = await res.json();
    expect(body.achievements).toHaveLength(1);
    expect(body.achievements[0].name).toBe("10 Tutorials");
  });

  it("returns 401 when not signed in", async () => {
    session.userId = "";
    const res = await getAchievements();
    expect(res.status).toBe(401);
    session.userId = userId;
  });
});
