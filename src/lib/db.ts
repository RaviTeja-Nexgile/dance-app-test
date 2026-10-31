import { PrismaClient } from "@prisma/client";

// Provide a default database URL so the app works on a fresh copy that has no
// .env file yet, matching the seed script's default. A real .env value (if
// present) is not overridden.
process.env.DATABASE_URL ??= "file:./dev.db";

// A single Prisma client instance shared across the app, so hot-reload in
// development does not open many database connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
