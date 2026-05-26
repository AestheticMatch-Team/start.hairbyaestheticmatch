"use client";

/**
 * Hair pre-quiz loading screen. Figma node 787:3563 (mobile 787:1509).
 */

import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./hair-pre-quiz.module.scss";

const LINES = [
  "Analyzing your pattern",
  "Modeling your progression curve",
  "Calibrating against 2,400+ similar profiles",
  "Mapping your treatment options",
  "Pulling {city} specialist data",
  "Compiling your assessment preview",
] as const;

const LINE_DELAY_MS = 900;
const COMPLETE_DELAY_MS = LINE_DELAY_MS * (LINES.length + 1);

function cityLabel(raw: string) {
  const t = raw.trim();
  if (!t) return "your area";
  const i = t.indexOf(",");
  return (i === -1 ? t : t.slice(0, i)).trim() || "your area";
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepCheck() {
  return (
    <span className={styles.hpqLoadingStepBullet}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="M2 5.25 4.25 7.5 8 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5.333 7.333V4.667a2.667 2.667 0 0 1 5.334 0v2.666" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3.333" y="7.333" width="9.334" height="6.667" rx="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

interface Props {
  city: string;
  onComplete: () => void;
  onBack?: () => void;
}

export function HairPreQuizLoading({ city, onComplete, onBack }: Props) {
  const label = cityLabel(city);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < LINES.length; i++) {
      timers.push(setTimeout(() => setVisibleCount(i + 1), LINE_DELAY_MS * i));
    }
    timers.push(setTimeout(onComplete, COMPLETE_DELAY_MS));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const pct = Math.min(100, (visibleCount / LINES.length) * 100);

  return (
    <div className={styles.hpqPage}>
      <header className={styles.hpqNav}>
        <span className={styles.hpqWordmark}>AestheticMatch Hair</span>
      </header>
      <div className={styles.hpqShell}>
        <div className={styles.hpqTopbar}>
          {onBack ? (
            <button type="button" className={styles.hpqBack} onClick={onBack}>
              <ChevronLeft />
              Back
            </button>
          ) : (
            <span className={styles.hpqBackSpacer} aria-hidden />
          )}
          <span className={styles.hpqBackSpacer} aria-hidden />
        </div>

        <div className={styles.hpqLoading}>
          <h1 className={styles.hpqLoadingHeadline}>
            Building your
            <br />
            assessment preview
          </h1>

          <div className={styles.hpqLoadingBar} aria-hidden>
            <div className={styles.hpqLoadingBarFill} style={{ width: `${pct}%` }} />
          </div>

          <div className={styles.hpqLoadingCard} aria-live="polite">
            {LINES.map((line, i) => {
              if (i >= visibleCount) return null;
              const text = line.replace("{city}", label);
              const isActive = i === visibleCount - 1;
              const isDone = !isActive || i === LINES.length - 1;
              return (
                <div
                  key={i}
                  className={clsx(styles.hpqLoadingStep, isDone && styles.hpqLoadingStepDone)}
                >
                  {isActive && i < LINES.length - 1 ? (
                    <span className={styles.hpqLoadingStepSpinner} aria-hidden />
                  ) : (
                    <StepCheck />
                  )}
                  <span>{text}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.hpqLoadingFoot}>
            <LockIcon />
            <span>This takes less than 30 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
