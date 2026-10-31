import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

/**
 * The "10 Tutorials" achievement is awarded automatically once a User has
 * completed 10 tutorials (requirement 7.1). It is awarded by the system based
 * on the User's progress, never by a person (requirements 7.3, 7.4).
 */
const TEN_TUTORIALS_ACHIEVEMENT = "10 Tutorials";
const TEN_TUTORIALS_THRESHOLD = 10;

/**
 * Award any achievements the User has newly earned, based on their current
 * progress. This is idempotent: the Achievement model has a unique
 * (userId, name) constraint, so re-running it never duplicates an award.
 *
 * The rule is kept module-private so the route module only exports the HTTP
 * handler (Next.js route-module contract).
 */
async function awardEarnedAchievements(userId: string): Promise<void> {
  const completionCount = await prisma.completion.count({
    where: { userId },
  });

  if (completionCount >= TEN_TUTORIALS_THRESHOLD) {
    await prisma.achievement.upsert({
      where: {
        userId_name: { userId, name: TEN_TUTORIALS_ACHIEVEMENT },
      },
      update: {},
      create: {
        userId,
        name: TEN_TUTORIALS_ACHIEVEMENT,
      },
    });
  }
}

/**
 * GET /api/achievements — the signed-in User's achievements (requirement 7.2).
 *
 * Achievements are awarded automatically from the User's progress, so this
 * handler first awards any newly earned achievements, then returns the full
 * list. There is deliberately no POST/PUT/DELETE handler: no person can award
 * an achievement by hand (requirement 7.4).
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  await awardEarnedAchievements(userId);

  const achievements = await prisma.achievement.findMany({
    where: { userId },
    orderBy: { earnedAt: "asc" },
    select: {
      id: true,
      name: true,
      earnedAt: true,
    },
  });

  return NextResponse.json({
    achievements: achievements.map((a) => ({
      id: a.id,
      name: a.name,
      earnedAt: a.earnedAt.toISOString(),
    })),
  });
}
