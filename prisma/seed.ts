import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Provide a default database URL so the seed works on a fresh copy that has
// no .env file yet. A real .env value (if present) is not overridden.
process.env.DATABASE_URL ??= "file:./dev.db";

// Ensure the schema exists before seeding, so `npm run dev` works against an
// empty database. `db push` is idempotent and creates the tables if missing.
execSync("npx prisma db push --skip-generate", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
});

const prisma = new PrismaClient();

async function main() {
  const email = "dancer@example.com";
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Dancer",
      email,
      passwordHash,
      level: "Beginner",
    },
  });

  console.log(`Seeded test login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
