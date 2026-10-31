"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "../profile.module.css";
import Achievements from "./achievements";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

type Favorite = {
  id: string;
  tutorialId: string;
  title: string;
  category: string;
  level: string;
};

type ScheduleEntry = {
  id: string;
  tutorialId: string;
  title: string;
  scheduledAt: string;
};

type Profile = {
  id: string;
  name: string;
  level: string;
  favorites: Favorite[];
  schedule: ScheduleEntry[];
};

type Tutorial = {
  id: string;
  title: string;
  category: string;
  level: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<string>("Beginner");
  const [savingLevel, setSavingLevel] = useState(false);

  // Add-favorite form state.
  const [favoriteTutorialId, setFavoriteTutorialId] = useState("");
  const [addingFavorite, setAddingFavorite] = useState(false);

  // Add-schedule form state.
  const [scheduleTutorialId, setScheduleTutorialId] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [addingSchedule, setAddingSchedule] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      setError("Sign in to view your profile.");
      return;
    }
    if (!res.ok) {
      setError("Could not load your profile.");
      return;
    }
    const data = (await res.json()) as Profile;
    setProfile(data);
    setLevel(data.level);
  }, []);

  const loadTutorials = useCallback(async () => {
    const res = await fetch("/api/tutorials");
    if (!res.ok) {
      return;
    }
    const data = (await res.json()) as { tutorials: Tutorial[] };
    setTutorials(data.tutorials);
  }, []);

  useEffect(() => {
    load();
    loadTutorials();
  }, [load, loadTutorials]);

  async function changeLevel(next: string) {
    setSavingLevel(true);
    setError(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: next }),
    });
    setSavingLevel(false);
    if (!res.ok) {
      setError("Could not save your level.");
      return;
    }
    setLevel(next);
    setProfile((p) => (p ? { ...p, level: next } : p));
  }

  async function addFavorite() {
    if (!favoriteTutorialId) {
      setError("Choose a tutorial to favorite.");
      return;
    }
    setAddingFavorite(true);
    setError(null);
    const res = await fetch(`/api/favorites/${favoriteTutorialId}`, {
      method: "POST",
    });
    setAddingFavorite(false);
    if (!res.ok) {
      setError("Could not add the favorite.");
      return;
    }
    setFavoriteTutorialId("");
    await load();
  }

  async function removeFavorite(tutorialId: string) {
    setError(null);
    const res = await fetch(`/api/favorites/${tutorialId}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not remove the favorite.");
      return;
    }
    setProfile((p) =>
      p
        ? {
            ...p,
            favorites: p.favorites.filter((f) => f.tutorialId !== tutorialId),
          }
        : p,
    );
  }

  async function addSchedule() {
    if (!scheduleTutorialId) {
      setError("Choose a tutorial to schedule.");
      return;
    }
    if (!scheduleAt) {
      setError("Choose a date and time for the practice session.");
      return;
    }
    setAddingSchedule(true);
    setError(null);
    const res = await fetch(`/api/schedule/${scheduleTutorialId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt: new Date(scheduleAt).toISOString() }),
    });
    setAddingSchedule(false);
    if (!res.ok) {
      setError("Could not add the practice session.");
      return;
    }
    setScheduleTutorialId("");
    setScheduleAt("");
    await load();
  }

  async function removeSchedule(entryId: string) {
    setError(null);
    const res = await fetch(`/api/schedule/${entryId}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not remove the practice session.");
      return;
    }
    setProfile((p) =>
      p
        ? {
            ...p,
            schedule: p.schedule.filter((s) => s.id !== entryId),
          }
        : p,
    );
  }

  if (error && !profile) {
    return (
      <main className={styles.main}>
        <p className={styles.error}>{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className={styles.main}>
        <p className={styles.loading}>Loading…</p>
      </main>
    );
  }

  const favoriteIds = new Set(profile.favorites.map((f) => f.tutorialId));
  const availableTutorials = tutorials.filter((t) => !favoriteIds.has(t.id));

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.name}>{profile.name}</h1>
        <div className={styles.levelRow}>
          <label htmlFor="level" className={styles.levelLabel}>
            Level
          </label>
          <select
            id="level"
            className={styles.select}
            value={level}
            disabled={savingLevel}
            onChange={(e) => changeLevel(e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Favorite tutorials</h2>
        {profile.favorites.length === 0 ? (
          <p className={styles.empty}>No favorite tutorials yet.</p>
        ) : (
          <ul className={styles.list}>
            {profile.favorites.map((f) => (
              <li key={f.id} className={styles.card}>
                <div>
                  <p className={styles.cardTitle}>{f.title}</p>
                  <p className={styles.cardMeta}>
                    {f.category} · {f.level}
                  </p>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFavorite(f.tutorialId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.addRow}>
          <select
            className={styles.select}
            value={favoriteTutorialId}
            onChange={(e) => setFavoriteTutorialId(e.target.value)}
            aria-label="Tutorial to favorite"
          >
            <option value="">Choose a tutorial…</option>
            {availableTutorials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <button
            className={styles.addButton}
            onClick={addFavorite}
            disabled={addingFavorite || !favoriteTutorialId}
          >
            Add favorite
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Practice schedule</h2>
        {profile.schedule.length === 0 ? (
          <p className={styles.empty}>No practice sessions scheduled.</p>
        ) : (
          <ul className={styles.list}>
            {profile.schedule.map((s) => (
              <li key={s.id} className={styles.card}>
                <div>
                  <p className={styles.cardTitle}>{s.title}</p>
                  <p className={styles.cardMeta}>
                    {new Date(s.scheduledAt).toLocaleString()}
                  </p>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeSchedule(s.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.addRow}>
          <select
            className={styles.select}
            value={scheduleTutorialId}
            onChange={(e) => setScheduleTutorialId(e.target.value)}
            aria-label="Tutorial to schedule"
          >
            <option value="">Choose a tutorial…</option>
            {tutorials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            className={styles.select}
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
            aria-label="Practice date and time"
          />
          <button
            className={styles.addButton}
            onClick={addSchedule}
            disabled={addingSchedule || !scheduleTutorialId || !scheduleAt}
          >
            Add session
          </button>
        </div>
      </section>

      <Achievements />
    </main>
  );
}
