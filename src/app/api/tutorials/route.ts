import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/tutorials
 *
 * Lists the dance tutorials, optionally filtered by category, level and search
 * text. The search text matches tutorials whose title contains the text
 * (case-insensitive).
 *
 * Query parameters:
 *   - category: one of the offered categories
 *   - level:    one of the offered levels
 *   - search:   text matched against the tutorial title
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const level = searchParams.get("level");
  const search = searchParams.get("search");

  const where: {
    category?: string;
    level?: string;
    title?: { contains: string };
  } = {};

  if (category) {
    where.category = category;
  }
  if (level) {
    where.level = level;
  }
  if (search) {
    where.title = { contains: search };
  }

  const tutorials = await prisma.tutorial.findMany({
    where,
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      category: true,
      level: true,
    },
  });

  return NextResponse.json({ tutorials });
}
