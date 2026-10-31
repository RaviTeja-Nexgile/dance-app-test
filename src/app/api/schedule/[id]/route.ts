import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

/**
 * POST /api/schedule/[id] — add a practice session to the schedule with a date
 * and time (requirement 5.5). The body carries `scheduledAt` as an ISO string.
 */
export async function POST(
  request: Request,
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const scheduledAt =
    typeof body === "object" && body !== null
      ? (body as { scheduledAt?: unknown }).scheduledAt
      : undefined;

  if (typeof scheduledAt !== "string" || Number.isNaN(Date.parse(scheduledAt))) {
    return NextResponse.json(
      { error: "scheduledAt must be a valid date and time" },
      { status: 400 },
    );
  }

  const entry = await prisma.scheduleEntry.create({
    data: {
      userId,
      tutorialId,
      scheduledAt: new Date(scheduledAt),
    },
  });

  return NextResponse.json({
    id: entry.id,
    tutorialId: entry.tutorialId,
    scheduledAt: entry.scheduledAt.toISOString(),
  });
}

/**
 * DELETE /api/schedule/[id] — remove a practice session from the schedule
 * (requirement 5.6). The `id` is the ScheduleEntry id.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const entryId = params.id;

  await prisma.scheduleEntry.deleteMany({
    where: { id: entryId, userId },
  });

  return NextResponse.json({ ok: true });
}
