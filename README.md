# Dance Studio Pro

A responsive web app where a User learns dance through tutorial videos, records themselves practicing with their camera, compares their recording side-by-side with the tutorial, and tracks their progress and achievements.

## Stack

- **Next.js** (App Router) — pages and API routes
- **Prisma** — ORM over a **SQLite** database
- **bcrypt** — password hashing
- **Tailwind CSS** — styling
- **Vitest** — unit tests
- **Playwright** — end-to-end journeys (under `e2e/`)

## Getting started

```bash
npm install
npm run dev
```

The app runs on the port given by the `PORT` environment variable (Next.js reads `PORT` directly). Open `http://localhost:3000` (or your `PORT`) to see the sign-in page.

The dev server seeds the database on start, so the test login below works against an empty database.

### Test login

- **User** — `dancer@example.com` / `password123`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (seeds the database first) |
| `npm run build` | Production build |
| `npm test` | Run unit tests (Vitest) |
| `npx prisma generate` | Generate the Prisma client |
| `npx prisma migrate dev --name init --skip-seed` | Create and apply the initial migration |
| `npm run db:seed` | Seed the database with the test login |

## Environment

Copy `.env.example` to `.env` and adjust as needed:

- `DATABASE_URL` — SQLite file location (default `file:./dev.db`)
- `SESSION_SECRET` — secret used to sign session cookies

## Health check

`GET /api/health` returns `200` with `{ "status": "ok" }`.
