import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/tutorials/[id] — one tutorial with its step-by-step instructions.
 *
 * The `steps` column stores a JSON-encoded ordered list of step strings, so it
 * is parsed back into an array before it is returned to the client.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const tutorial = await prisma.tutorial.findUnique({
    where: { id: params.id },
  });

  if (!tutorial) {
    return NextResponse.json(
      { error: "Tutorial not found" },
      { status: 404 },
    );
  }

  let steps: string[] = [];
  try {
    const parsed = JSON.parse(tutorial.steps);
    if (Array.isArray(parsed)) {
      steps = parsed;
    }
  } catch {
    // A malformed steps value is treated as no steps rather than failing the
    // whole request.
    steps = [];
  }

  return NextResponse.json({
    id: tutorial.id,
    title: tutorial.title,
    category: tutorial.category,
    level: tutorial.level,
    videoPath: tutorial.videoPath,
    steps,
  });
}
