"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./hair-post-quiz-loading.module.scss";

type StepStatus = "complete" | "active" | "in-progress" | "pending";

interface Step {
  index: string;
  status: StepStatus;
  text: string;
  icon: "clipboard" | "clock18" | "nodes" | "mail";
}

const STEPS: Step[] = [
  { index: "Step 01", status: "complete", text: "Your clinical questionnaire complete", icon: "clipboard" },
  { index: "Step 02", status: "active", text: "Your 18-month window is now active", icon: "clock18" },
  { index: "Step 03", status: "in-progress", text: "Our team is mapping your exact products, doses, and provider matches", icon: "nodes" },
  { index: "Step 04", status: "pending", text: "Your plan, delivered", icon: "mail" },
];

const COMPLETE_DELAY_MS = 6000;

const STATUS_LABEL: Record<StepStatus, string> = {
  complete: "Complete",
  active: "Active",
  "in-progress": "In progress",
  pending: "Pending",
};

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeaderSpinner() {
  return <span className={styles.hpqlHeaderSpinner} aria-hidden />;
}

function StepIcon({ icon }: { icon: Step["icon"] }) {
  switch (icon) {
    case "clipboard":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="12" y="3.5" width="8" height="3" rx="0.6" fill="currentColor" stroke="none" />
          <path d="M10 5h2v2h8V5h2a2 2 0 0 1 2 2v19a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          <path d="M12.5 16.5l2.5 2.5 5-5.5" />
        </svg>
      );
    case "clock18":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <circle cx="16" cy="16" r="11" opacity="0.28" />
          <path d="M16 5 A 11 11 0 0 1 26 21" strokeWidth="2" />
          <text x="16" y="20" textAnchor="middle" fontSize="10" fontWeight="500" fontFamily="Instrument Serif, serif" fill="currentColor" stroke="none">
            18
          </text>
        </svg>
      );
    case "nodes":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
          <path className={styles.hpqlConstLine} d="M9 11 L16 7 L23 11 L21 18 L11 21 L17 25" />
          <circle className={styles.hpqlNode1} cx="9" cy="11" r="1.9" fill="currentColor" />
          <circle className={styles.hpqlNode2} cx="16" cy="7" r="1.9" fill="currentColor" />
          <circle className={styles.hpqlNode3} cx="23" cy="11" r="1.9" fill="currentColor" />
          <circle className={styles.hpqlNode4} cx="21" cy="18" r="1.9" fill="currentColor" />
          <circle className={styles.hpqlNode5} cx="11" cy="21" r="1.9" fill="currentColor" />
          <circle className={styles.hpqlNode6} cx="17" cy="25" r="1.9" fill="currentColor" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="5" y="9" width="22" height="15" rx="2" />
          <path d="M5 11 L16 19 L27 11" />
          <circle cx="16" cy="22" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

interface Props {
  /** Same string as prophecy screen 3 cost-context pill (`renderScreen3().pill`). */
  identityPill: string;
  onComplete: () => void;
}

export function HairPostQuizLoading({ identityPill, onComplete }: Props) {
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCtaReady(true), COMPLETE_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.hpqlPage}>
      <header className={styles.hpqlHero}>
        <div className={styles.hpqlNavBar}>
          <span className={styles.hpqlWordmark}>AestheticMatch Hair</span>
        </div>

        <div className={styles.hpqlCoverStage} aria-hidden>
          <div className={styles.hpqlCoverGlow} />
          <div className={styles.hpqlCover} aria-label="Your Personalized Hair Assessment cover" />
        </div>

        <div className={styles.hpqlNavyFade} aria-hidden />
      </header>

      <div className={styles.hpqlPageWrap}>
        <main className={styles.hpqlCard} aria-live="polite">
          <div className={styles.hpqlCardTop}>
            <span className={styles.hpqlPill}>
              <HeartIcon />
              Clinical Review
            </span>
            <HeaderSpinner />
          </div>

          <div className={styles.hpqlHeadlineBlock}>
            <h1 className={styles.hpqlHeadline}>
              Tailoring <em>your</em> plan.
            </h1>
            <p className={styles.hpqlIdentity}>{identityPill}</p>
          </div>

          <div className={styles.hpqlTimeline}>
            {STEPS.map((s, i) => {
              const isFirst = i === 0;
              const isLast = i === STEPS.length - 1;
              return (
                <div
                  key={i}
                  className={clsx(
                    styles.hpqlStage,
                    s.status === "complete" && styles.hpqlStageComplete,
                    s.status === "active" && styles.hpqlStageActiveDone,
                    s.status === "in-progress" && styles.hpqlStageActive,
                    s.status === "pending" && styles.hpqlStagePending,
                  )}
                  style={{ animationDelay: `${1.55 + i * 0.23}s` }}
                >
                  <div className={styles.hpqlRail}>
                    <span
                      className={clsx(styles.hpqlRailAbove, isFirst && styles.hpqlRailHidden)}
                      aria-hidden
                    />
                    <div className={styles.hpqlIconCircle}>
                      <StepIcon icon={s.icon} />
                    </div>
                    <span
                      className={clsx(styles.hpqlRailBelow, isLast && styles.hpqlRailHidden)}
                      aria-hidden
                    />
                  </div>
                  <div className={styles.hpqlStageBody}>
                    <span className={styles.hpqlStageLabel}>
                      {s.index} <span className={styles.hpqlDotSep}>·</span> {STATUS_LABEL[s.status]}
                    </span>
                    <span className={styles.hpqlStageText}>{s.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.hpqlFooterCopy}>
            <p className={styles.hpqlCloser}>The clock is the issue, not the cost.</p>
            <p className={styles.hpqlSub}>We&rsquo;ll email you the moment your plan is ready.</p>
          </div>

          <div className={styles.hpqlCtaWrap}>
            <button
              type="button"
              className={styles.hpqlCta}
              onClick={onComplete}
              disabled={!ctaReady}
            >
              Continue to photo upload
              <ArrowRight />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
