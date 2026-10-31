import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

/**
 * GET /api/profile — the signed-in User's name, level, favorite tutorials and
 * practice schedule (requirement 5.1, 5.7).
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      favorites: { include: { tutorial: true } },
      schedule: { include: { tutorial: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    level: user.level,
    favorites: user.favorites.map((f) => ({
      id: f.id,
      tutorialId: f.tutorialId,
      title: f.tutorial.title,
      category: f.tutorial.category,
      level: f.tutorial.level,
    })),
    schedule: user.schedule
      .map((s) => ({
        id: s.id,
        tutorialId: s.tutorialId,
        title: s.tutorial.title,
        scheduledAt: s.scheduledAt.toISOString(),
      }))
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
  });
}

/**
 * PUT /api/profile — update the signed-in User's level (requirement 5.2).
 */
export async function PUT(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const level =
    typeof body === "object" && body !== null
      ? (body as { level?: unknown }).level
      : undefined;

  if (typeof level !== "string" || !LEVELS.includes(level as (typeof LEVELS)[number])) {
    return NextResponse.json(
      { error: "Level must be Beginner, Intermediate or Advanced" },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { level },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    level: user.level,
  });
}
