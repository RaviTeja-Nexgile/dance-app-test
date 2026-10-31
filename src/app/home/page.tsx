import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CATEGORIES, LEVELS } from "@/lib/tutorials";
import styles from "../home.module.css";

export const dynamic = "force-dynamic";

type Tutorial = {
  id: string;
  title: string;
  category: string;
  level: string;
};

function matches(t: Tutorial, category: string, level: string, search: string) {
  if (category && t.category !== category) return false;
  if (level && t.level !== level) return false;
  if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
    return false;
  return true;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; level?: string; search?: string };
}) {
  const userId = await getSessionUserId();
  if (!userId) {
    return (
      <main className={styles.main}>
        <p className={styles.empty}>Sign in to browse tutorials.</p>
      </main>
    );
  }

  const category = searchParams.category ?? "";
  const level = searchParams.level ?? "";
  const search = searchParams.search ?? "";

  const tutorials = await prisma.tutorial.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, category: true, level: true },
  });

  const visible = tutorials.filter((t) => matches(t, category, level, search));

  return (
    <main className={styles.main}>
      <header className={styles.topbar}>
        <span className={styles.appName}>Dance Studio Pro</span>
        <span className={styles.avatar} aria-label="Your avatar" />
      </header>

      <form className={styles.filters} method="get" action="/home">
        <input
          className={styles.search}
          type="search"
          name="search"
          placeholder="Search tutorials"
          defaultValue={search}
        />

        {/* Carry the current level along when a category chip is clicked, and
            the current category along when a level chip is clicked, so the two
            filters can be combined instead of one silently dropping the other. */}
        {level ? <input type="hidden" name="level" value={level} /> : null}

        <div className={styles.chipRow} role="group" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="submit"
              name="category"
              value={c}
              className={`${styles.chip} ${
                category === c ? styles.chipActive : ""
              }`}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>

        {category ? <input type="hidden" name="category" value={category} /> : null}

        <div className={styles.chipRow} role="group" aria-label="Level">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="submit"
              name="level"
              value={l}
              className={`${styles.chip} ${
                level === l ? styles.chipActive : ""
              }`}
              aria-pressed={level === l}
            >
              {l}
            </button>
          ))}
        </div>
      </form>

      {visible.length === 0 ? (
        <p className={styles.empty}>No tutorials match your filters.</p>
      ) : (
        <ul className={styles.grid}>
          {visible.map((t) => (
            <li key={t.id} className={styles.card}>
              <h2 className={styles.title}>{t.title}</h2>
              <p className={styles.meta}>
                <span className={styles.tag}>{t.category}</span>
                <span className={styles.tag}>{t.level}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
