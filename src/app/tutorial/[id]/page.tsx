"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../../tutorial.module.css";

type Tutorial = {
  id: string;
  title: string;
  category: string;
  level: string;
  videoPath: string;
  steps: string[];
};

/**
 * The Tutorial screen: plays the tutorial video, shows its step-by-step
 * instructions, and offers slow-motion (half speed) playback plus pause and
 * resume controls (requirement 3).
 */
export default function TutorialPage({ params }: { params: { id: string } }) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slowMotion, setSlowMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/tutorials/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Tutorial not found");
        }
        return res.json();
      })
      .then((data: Tutorial) => {
        if (!cancelled) setTutorial(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  // Keep the video's playback rate in sync with the slow-motion toggle.
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = slowMotion ? 0.5 : 1;
    }
  }, [slowMotion]);

  function toggleSlowMotion() {
    setSlowMotion((v) => !v);
  }

  function togglePause() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  if (error) {
    return (
      <main className={styles.container}>
        <p className={styles.error}>{error}</p>
      </main>
    );
  }

  if (!tutorial) {
    return (
      <main className={styles.container}>
        <p className={styles.loading}>Loading…</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.player}>
        <video
          ref={videoRef}
          className={styles.video}
          src={tutorial.videoPath}
          controls
          autoPlay
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{tutorial.title}</h1>
        <div className={styles.meta}>
          <span className={styles.badge}>{tutorial.category}</span>
          <span className={styles.badge}>{tutorial.level}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={togglePause}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          className={
            slowMotion ? styles.controlButtonActive : styles.controlButton
          }
          onClick={toggleSlowMotion}
          aria-pressed={slowMotion}
        >
          Slow motion {slowMotion ? "on" : "off"}
        </button>
      </div>

      <section className={styles.steps}>
        <h2 className={styles.stepsTitle}>Step-by-step instructions</h2>
        <ol className={styles.stepList}>
          {tutorial.steps.map((step, i) => (
            <li key={i} className={styles.step}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepText}>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
