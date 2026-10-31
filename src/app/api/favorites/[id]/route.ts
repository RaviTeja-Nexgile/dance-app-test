import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

/**
 * POST /api/favorites/[id] — mark a tutorial as a favorite (requirement 5.3).
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const tutorialId = params.id;

  const tutorial = await prisma.tutorial.findUnique({
    where: { id: tutorialId },
  });
  if (!tutorial) {
    return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
  }

  const favorite = await prisma.favorite.upsert({
    where: { userId_tutorialId: { userId, tutorialId } },
    update: {},
    create: { userId, tutorialId },
  });

  return NextResponse.json({
    id: favorite.id,
    tutorialId: favorite.tutorialId,
  });
}

/**
 * DELETE /api/favorites/[id] — remove a tutorial from favorites (requirement 5.4).
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const tutorialId = params.id;

  await prisma.favorite.deleteMany({
    where: { userId, tutorialId },
  });

  return NextResponse.json({ ok: true });
}
