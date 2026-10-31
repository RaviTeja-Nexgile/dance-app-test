import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { CATEGORIES, LEVELS } from "@/lib/tutorials";

// Mock the Prisma client so the route runs against an in-memory fake rather
// than a real database.
const findMany = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    tutorial: {
      findMany: (...args: unknown[]) => findMany(...args),
    },
  },
}));

const TUTORIALS = [
  { id: "1", title: "Hip-Hop Basics", category: "Hip-Hop", level: "Beginner" },
  {
    id: "2",
    title: "Bollywood Groove",
    category: "Bollywood",
    level: "Intermediate",
  },
  {
    id: "3",
    title: "Classical Footwork",
    category: "Classical",
    level: "Advanced",
  },
  {
    id: "4",
    title: "Freestyle Flow",
    category: "Freestyle",
    level: "Beginner",
  },
];

function request(url: string) {
  return new NextRequest(`http://localhost${url}`);
}

beforeEach(() => {
  findMany.mockReset();
  findMany.mockResolvedValue(TUTORIALS);
});

describe("GET /api/tutorials", () => {
  it("lists all tutorials with no filters", async () => {
    const res = await GET(request("/api/tutorials"));
    const body = await res.json();
    expect(body.tutorials).toEqual(TUTORIALS);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });

  it("filters by category", async () => {
    await GET(request("/api/tutorials?category=Hip-Hop"));
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { category: "Hip-Hop" } }),
    );
  });

  it("filters by level", async () => {
    await GET(request("/api/tutorials?level=Beginner"));
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { level: "Beginner" } }),
    );
  });

  it("filters by search text against the title", async () => {
    await GET(request("/api/tutorials?search=groove"));
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { title: { contains: "groove" } },
      }),
    );
  });

  it("combines category, level and search filters", async () => {
    await GET(
      request("/api/tutorials?category=Hip-Hop&level=Beginner&search=basics"),
    );
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          category: "Hip-Hop",
          level: "Beginner",
          title: { contains: "basics" },
        },
      }),
    );
  });

  it("returns only id, title, category and level", async () => {
    await GET(request("/api/tutorials"));
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: { id: true, title: true, category: true, level: true },
      }),
    );
  });
});

describe("offered categories and levels", () => {
  it("offers the five required categories", () => {
    expect(CATEGORIES).toEqual([
      "Hip-Hop",
      "Bollywood",
      "Classical",
      "Contemporary",
      "Freestyle",
    ]);
  });

  it("offers the three required levels", () => {
    expect(LEVELS).toEqual(["Beginner", "Intermediate", "Advanced"]);
  });
});
