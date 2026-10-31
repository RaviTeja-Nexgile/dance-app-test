import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

// Point the shared Prisma client (src/lib/db.ts) at a throwaway SQLite
// database before the route module is imported, so the route under test reads
// and writes only this test's data and never touches the app's real database.
process.env.DATABASE_URL = "file:./tutorial-test.db";

const prisma = new PrismaClient();

beforeAll(async () => {
  // Create the tables the tests need. `db push` is idempotent.
  const { execSync } = await import("node:child_process");
  execSync("npx prisma db push --skip-generate", {
    stdio: "ignore",
    env: { ...process.env, DATABASE_URL: "file:./tutorial-test.db" },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/tutorials/[id]", () => {
  it("returns a tutorial with its title, category, level and steps", async () => {
    const { GET } = await import("./route");

    const tutorial = await prisma.tutorial.create({
      data: {
        title: "Moonwalk Basics",
        category: "Hip-Hop",
        level: "Beginner",
        videoPath: "/videos/moonwalk.mp4",
        steps: JSON.stringify([
          "Stand with your feet together.",
          "Slide one foot back.",
          "Shift your weight.",
        ]),
      },
    });

    const res = await GET(new Request("http://localhost"), {
      params: { id: tutorial.id },
    });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.title).toBe("Moonwalk Basics");
    expect(body.category).toBe("Hip-Hop");
    expect(body.level).toBe("Beginner");
    expect(body.videoPath).toBe("/videos/moonwalk.mp4");
    expect(body.steps).toEqual([
      "Stand with your feet together.",
      "Slide one foot back.",
      "Shift your weight.",
    ]);
  });

  it("returns 404 for an unknown tutorial id", async () => {
    const { GET } = await import("./route");

    const res = await GET(new Request("http://localhost"), {
      params: { id: "does-not-exist" },
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Tutorial not found");
  });
});
