"use client";

import { useEffect, useState } from "react";
import styles from "../achievements.module.css";

type Achievement = {
  id: string;
  name: string;
  earnedAt: string;
};

/**
 * The User's achievements, shown on their profile (requirement 7.2).
 *
 * Achievements are awarded automatically by the server based on the User's
 * progress, so this component only reads and displays them — there is no
 * control to award one by hand (requirement 7.4).
 */
export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/achievements");
      if (cancelled) return;
      if (!res.ok) {
        setLoaded(true);
        return;
      }
      const data = (await res.json()) as { achievements: Achievement[] };
      setAchievements(data.achievements);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Achievements</h2>
      {!loaded ? (
        <p className={styles.empty}>Loading…</p>
      ) : achievements.length === 0 ? (
        <p className={styles.empty}>No achievements yet. Keep practicing!</p>
      ) : (
        <ul className={styles.list}>
          {achievements.map((a) => (
            <li key={a.id} className={styles.card}>
              <span className={styles.badge} aria-hidden="true">
                ★
              </span>
              <div>
                <p className={styles.cardTitle}>{a.name}</p>
                <p className={styles.cardMeta}>
                  Earned {new Date(a.earnedAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
