"use client";

/**
 * Hair pre-quiz prophecy screens — 3 steps after loading.
 * Screens 1 & 3 follow AestheticMatch_Hair_Prophecy1and3_Static_Spec (v3.0).
 * Screen 2: AestheticMatch_Hair_Prophecy2_Logic_Spec (richer logic; unchanged here).
 */

import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./hair-pre-quiz.module.scss";
import {
  PillIcon,
  BottleIcon,
  BlendModeIcon,
  DropletIcon,
  DatabasePlusIcon,
  HourglassLowIcon,
  WashEcoIcon,
  TargetArrowIcon,
  ClipboardTextIcon,
  Dna2Icon,
  CheckBadge,
  XBadge,
} from "./icons";
import {
  mirrorLabelToPpQ1,
  outcomeLabelToPpQ5,
  parseQuizAge,
  renderScreen1,
  renderScreen3,
  STATIC_DEADLINE_MONTHS,
  STATIC_TRAJECTORY_NOTE,
  STATIC_TRAJECTORY_STAGE_LABELS,
  verifyHairProphecyStaticSpec,
} from "@/lib/hair/hair-prophecy-static";
import { buildProphecyScreen2 } from "@/lib/hair/hair-prophecy-screen2";
import type { HairPriceVariant } from "@/lib/resolve-hair-price-variant";

function formatHairAssessmentCta(priceVariant: HairPriceVariant) {
  const displayPrice = `$${priceVariant}`;
  const installment = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceVariant / 4);
  return { displayPrice, installment };
}

const PROGRESSION_IMAGES = [
  "/hair-pre-quiz/stage-1.jpg",
  "/hair-pre-quiz/stage-2.jpg",
  "/hair-pre-quiz/stage-3.jpg",
] as const;

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10 12L6 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrajectoryScreen({
  age,
  q1Mirror,
  onNext,
  onBack,
}: {
  age: string;
  q1Mirror: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const pp_q1 = mirrorLabelToPpQ1(q1Mirror);
  const ageNum = parseQuizAge(age);
  const s1 = renderScreen1({ pp_q1, age: ageNum });

  const frames = [
    {
      ageLabel: `Age ${s1.age_now} (NOW)`,
      stageLabel: STATIC_TRAJECTORY_STAGE_LABELS[0],
      src: PROGRESSION_IMAGES[0],
    },
    {
      ageLabel: `Age ${s1.age_plus5}`,
      stageLabel: STATIC_TRAJECTORY_STAGE_LABELS[1],
      src: PROGRESSION_IMAGES[1],
    },
    {
      ageLabel: `Age ${s1.age_plus10}`,
      stageLabel: STATIC_TRAJECTORY_STAGE_LABELS[2],
      src: PROGRESSION_IMAGES[2],
    },
  ];

  return (
    <>
      <div className={styles.hpqTopbar}>
        <button type="button" className={styles.hpqBack} onClick={onBack}>
          <ChevronLeft />
          Back
        </button>
        <span className={styles.hpqBackSpacer} aria-hidden />
      </div>

      <div className={styles.hpqProphecy}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span className={styles.hpqEyebrow}>
            STEP 1 OF 3 · YOUR TRAJECTORY
          </span>
          <h1 className={styles.hpqProphecyTitle}>
            Without intervention, here&apos;s
            <br />
            where you&apos;re headed.
          </h1>
        </div>

        <div className={styles.hpqTimelineSection}>
          <div className={styles.hpqTimelineRow}>
            {frames.map((f) => (
              <p key={f.ageLabel} className={styles.hpqTimelineLabel}>
                {f.ageLabel}
              </p>
            ))}
          </div>
          <div className={styles.hpqTimelineBar}>
            <span className={styles.hpqTimelineDot} />
            <span className={styles.hpqTimelineDot} />
            <span className={styles.hpqTimelineDot} />
          </div>
        </div>

        <div className={styles.hpqProphecyCards}>
          {frames.map((frame, i) => (
            <Fragment key={frame.ageLabel}>
              <div
                className={clsx(
                  styles.hpqAgeCardOuter,
                  i % 2 === 0
                    ? styles.hpqAgeCardOuterOdd
                    : styles.hpqAgeCardOuterEven,
                )}
              >
                <p className={styles.hpqAgeCardMobileLabel}>{frame.ageLabel}</p>
                <div className={styles.hpqAgeCard}>
                  <img
                    className={styles.hpqAgePhoto}
                    src={frame.src}
                    alt={frame.stageLabel}
                  />
                  <p className={styles.hpqAgeCaption}>{frame.stageLabel}</p>
                </div>

                {i !== 0 && i % 2 === 1 && (
                  <svg
                    className={styles.hpqConnectorLeft}
                    width="30"
                    height="203"
                    viewBox="0 0 30 203"
                    fill="none"
                    aria-hidden
                  >
                    <circle cx="4" cy="4" r="4" fill="#5A7A96" />
                    <path
                      d="M3.5 1V190C3.5 196.627 8.87258 202 15.5 202H29.5"
                      stroke="#5A7A96"
                      strokeDasharray="4 4"
                    />
                  </svg>
                )}
                {i !== 0 && i % 2 === 0 && (
                  <svg
                    className={styles.hpqConnectorRight}
                    width="27"
                    height="207"
                    viewBox="0 0 27 207"
                    fill="none"
                    aria-hidden
                  >
                    <circle cx="22.5" cy="4" r="4" fill="#5A7A96" />
                    <path
                      d="M23 1V194C23 200.627 17.6274 206 11 206H0"
                      stroke="#5A7A96"
                      strokeDasharray="4 4"
                    />
                  </svg>
                )}
              </div>
            </Fragment>
          ))}
        </div>

        <p className={styles.hpqTrajectoryNote}>{STATIC_TRAJECTORY_NOTE}</p>

        <div className={styles.hpqDeadlineCard}>
          <p className={styles.hpqDeadlineEyebrow}>THE BIOLOGICAL DEADLINE</p>
          <p className={styles.hpqDeadlineBody}>
            Hair follicles fail in stages. Once a follicle has been weakening
            for ~5 years, it can&apos;t be revived — not by medication, not by
            transplant.
          </p>
          <p className={styles.hpqDeadlineBody}>
            Based on your timeline, you have approximately
          </p>
          <p className={styles.hpqDeadlineBig}>{STATIC_DEADLINE_MONTHS} MONTHS</p>
          <p className={styles.hpqDeadlineBody}>
            before another {s1.follicles_display} follicles cross that
            threshold permanently.
          </p>
        </div>

        <div className={styles.hpqNextWrap}>
          <button
            type="button"
            className={clsx(styles.hpqNext, styles.hpqNextWide)}
            onClick={onNext}
          >
            See your options →
          </button>
        </div>
      </div>
    </>
  );
}

function TreatmentsScreen({
  q1,
  q2,
  q3,
  q4,
  age,
  q5Outcome,
  onNext,
  onBack,
}: {
  q1: string;
  q2: string;
  q3: string[];
  q4: string;
  age: string;
  q5Outcome: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const pp_q1 = mirrorLabelToPpQ1(q1);
  const pp_q5 = outcomeLabelToPpQ5(q5Outcome);
  const ageNum = parseQuizAge(age);
  const s2 = buildProphecyScreen2({
    pp_q1,
    pp_q2_label: q2,
    pp_q3_tried_labels: q3,
    pp_q4_family_history_label: q4,
    pp_q5,
    age: ageNum,
  });

  const iconFor = (tx: string) => {
    switch (tx) {
      case "oral":
        return <PillIcon />;
      case "topical":
        return <BottleIcon />;
      case "combination":
        return <BlendModeIcon />;
      case "prp":
        return <DropletIcon />;
      case "supplements":
        return <DatabasePlusIcon />;
      case "smp":
        return <TargetArrowIcon />;
      case "transplant":
        return <BlendModeIcon />;
      case "hair_systems":
        return <WashEcoIcon />;
      case "monitoring":
        return <ClipboardTextIcon />;
      default:
        return <ClipboardTextIcon />;
    }
  };

  const good = s2.possiblyRelevant.map((r) => ({
    icon: iconFor(r.tx),
    label: r.label,
  }));

  const bad = s2.likelyNot.map((r) => ({
    icon: iconFor(r.tx),
    label: r.reason ? `${r.label} — ${r.reason}` : r.label,
  }));

  return (
    <>
      <div className={styles.hpqTopbar}>
        <button type="button" className={styles.hpqBack} onClick={onBack}>
          <ChevronLeft />
          Back
        </button>
        <span className={styles.hpqBackSpacer} aria-hidden />
      </div>

      <div className={styles.hpqProphecy}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span className={styles.hpqEyebrow}>Step 2 of 3 · Your Options</span>
          <h1 className={styles.hpqProphecyTitle}>
            Here&apos;s the universe of treatments for someone in your position.
          </h1>
        </div>

        <div className={styles.hpqTreatmentGrid}>
          <div
            className={clsx(styles.hpqTreatmentCol, styles.hpqTreatmentColGood)}
          >
            <div className={styles.hpqTreatmentHead}>
              <span>Possibly relevant for you</span>
              <span className={styles.hpqTreatmentBadge}>
                <CheckBadge />
              </span>
            </div>
            <div className={styles.hpqTreatmentList}>
              {good.map((row) => (
                <div key={row.label} className={styles.hpqTreatmentRow}>
                  <span className={styles.hpqTreatmentIcon}>{row.icon}</span>
                  <span>{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={clsx(styles.hpqTreatmentCol, styles.hpqTreatmentColBad)}
          >
            <div className={styles.hpqTreatmentHead}>
              <span>Likely not for you</span>
              <span className={styles.hpqTreatmentBadge}>
                <XBadge />
              </span>
            </div>
            <div className={styles.hpqTreatmentList}>
              {bad.map((row) => (
                <div key={row.label} className={styles.hpqTreatmentRow}>
                  <span className={styles.hpqTreatmentIcon}>{row.icon}</span>
                  <span>{row.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.hpqExplainerCard}>
          <div className={styles.hpqExplainerRow}>
            <span className={styles.hpqExplainerIcon}>
              <TargetArrowIcon />
            </span>
            <span>
              Out of the {good.length} that could work for you, only one or two
              will actually move the needle. The wrong one wastes 2 years and
              thousands of dollars.
            </span>
          </div>
          <div className={styles.hpqExplainerRow}>
            <span className={styles.hpqExplainerIcon}>
              <ClipboardTextIcon />
            </span>
            <span>
              Your full report identifies the exact protocol — molecule, dose,
              sequencing, timeline.
            </span>
          </div>
          <div className={styles.hpqExplainerRow}>
            <span className={styles.hpqExplainerIcon}>
              <Dna2Icon />
            </span>
            <span>
              Then our concierge handles the rest. Prescription, provider
              matching, follow-up.
            </span>
          </div>
        </div>

        <div className={styles.hpqNextWrap}>
          <button
            type="button"
            className={clsx(styles.hpqNext, styles.hpqNextWide)}
            onClick={onNext}
          >
            See What This Costs →
          </button>
        </div>
      </div>
    </>
  );
}

function CostForecastScreen({
  age,
  city,
  q1Mirror,
  q5Outcome,
  priceVariant,
  onComplete,
  onBack,
}: {
  age: string;
  city: string;
  q1Mirror: string;
  q5Outcome: string;
  priceVariant: HairPriceVariant;
  onComplete: () => void;
  onBack: () => void;
}) {
  const { displayPrice, installment } = formatHairAssessmentCta(priceVariant);
  const pp_q1 = mirrorLabelToPpQ1(q1Mirror);
  const pp_q5 = outcomeLabelToPpQ5(q5Outcome);
  const ageNum = parseQuizAge(age);
  const s3 = renderScreen3({
    pp_q1,
    pp_q5,
    age: ageNum,
    city,
  });

  return (
    <>
      <div className={styles.hpqTopbar}>
        <button type="button" className={styles.hpqBack} onClick={onBack}>
          <ChevronLeft />
          Back
        </button>
        <span className={styles.hpqBackSpacer} aria-hidden />
      </div>

      <div className={styles.hpqProphecy}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span className={styles.hpqEyebrow}>
            STEP 3 OF 3 · YOUR COST FORECAST
          </span>
          <h1 className={styles.hpqProphecyTitle}>
            The next 5 years cost you {s3.savings_display} less
            <br />
            with us than without.
          </h1>
        </div>

        <div className={styles.hpqCostGrid}>
          <div className={clsx(styles.hpqCostCol, styles.hpqCostColBad)}>
            <p className={styles.hpqCostHead}>WITHOUT US</p>
            <div className={styles.hpqCostBody}>
              <p className={styles.hpqCostAmount}>{s3.without_display}</p>
              <p className={styles.hpqCostNarrative}>{s3.narrative}</p>
            </div>
          </div>

          <div className={clsx(styles.hpqCostCol, styles.hpqCostColGood)}>
            <p className={styles.hpqCostHead}>WITH AESTHETICMATCH</p>
            <div className={styles.hpqCostBody}>
              <p className={styles.hpqCostAmount}>{s3.with_display}</p>
              <p className={styles.hpqCostSubcopy}>
                Your assessment + the right protocol set up by our team.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.hpqCostContext}>{s3.pill}</div>

        <div className={styles.hpqSavings}>
          <p className={styles.hpqSavingsEyebrow}>YOUR PROJECTED SAVINGS</p>
          <p className={styles.hpqSavingsAmount}>{s3.savings_display}</p>
          <p className={styles.hpqSavingsBody}>
            Plus the time you don&apos;t waste on treatments that won&apos;t
            work for you.
          </p>
        </div>

        <div className={styles.hpqClosingCard}>
          <div className={styles.hpqClosingText}>
            <p className={styles.hpqClosingEyebrow}>
              The clock is the issue, not the cost.
            </p>
            <p className={styles.hpqClosingBody}>
            You can keep guessing what works. Or you have our team set it up for you.
            </p>
          </div>
          <div className={styles.hpqNextWrap}>
            <button
              type="button"
              className={styles.hpqNext}
              onClick={onComplete}
            >
              Unlock my full assessment — {displayPrice}
            </button>
            <p className={styles.hpqCtaSubtext}>
              or 4 payments of {installment} with Klarna or Affirm · Money-back
              guarantee
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

interface Props {
  firstName: string;
  age: string;
  city: string;
  q1Mirror: string;
  q2Duration: string;
  q3Tried: string[];
  q4FamilyHistory: string;
  q5Outcome: string;
  priceVariant: HairPriceVariant;
  onComplete: () => void;
  onBackFromStep1: () => void;
  onScreenViewed?: (screen: 1 | 2 | 3) => void;
}

export function HairProphecyScreens({
  firstName: _firstName,
  age,
  city,
  q1Mirror,
  q2Duration,
  q3Tried,
  q4FamilyHistory,
  q5Outcome,
  priceVariant,
  onComplete,
  onBackFromStep1,
  onScreenViewed,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      try {
        verifyHairProphecyStaticSpec();
      } catch (e) {
        console.error("[HairProphecy] static spec verification failed", e);
      }
    }
  }, []);

  useEffect(() => {
    onScreenViewed?.(step);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step, onScreenViewed]);

  useEffect(() => {
    const pp_q1 = mirrorLabelToPpQ1(q1Mirror);
    const pp_q5 = outcomeLabelToPpQ5(q5Outcome);
    const ageNum = parseQuizAge(age);
    if (step === 1) {
      const s1 = renderScreen1({ pp_q1, age: ageNum });
      console.info("[HairProphecy]", {
        screen: 1,
        band: s1.band,
        inputs: { pp_q1, age: ageNum, q1_mirror: q1Mirror },
      });
    }
    if (step === 2) {
      const s2 = buildProphecyScreen2({
        pp_q1,
        pp_q2_label: q2Duration,
        pp_q3_tried_labels: q3Tried,
        pp_q4_family_history_label: q4FamilyHistory,
        pp_q5,
        age: ageNum,
      });
      console.info("[HairProphecy]", {
        screen: 2,
        stage: s2.stage,
        inputs: {
          pp_q1,
          pp_q5,
          age: ageNum,
          pp_q2: q2Duration,
          pp_q3: q3Tried,
          pp_q4: q4FamilyHistory,
        },
        possiblyRelevant: s2.possiblyRelevant,
        likelyNot: s2.likelyNot,
        meta: s2.meta,
      });
    }
    if (step === 3) {
      const s3 = renderScreen3({
        pp_q1,
        pp_q5,
        age: ageNum,
        city,
      });
      console.info("[HairProphecy]", {
        screen: 3,
        band: s3.band,
        inputs: {
          pp_q1,
          pp_q5,
          age: ageNum,
          city,
          q5_outcome: q5Outcome,
          pill: s3.pill,
        },
      });
    }
  }, [step, q1Mirror, q2Duration, q3Tried, q4FamilyHistory, q5Outcome, age, city]);

  return (
    <div className={styles.hpqPage}>
      <header className={styles.hpqNav}>
        <span className={styles.hpqWordmark}>AestheticMatch Hair</span>
      </header>
      <div className={styles.hpqShell}>
        {step === 1 && (
          <TrajectoryScreen
            age={age}
            q1Mirror={q1Mirror}
            onNext={() => setStep(2)}
            onBack={onBackFromStep1}
          />
        )}
        {step === 2 && (
          <TreatmentsScreen
            q1={q1Mirror}
            q2={q2Duration}
            q3={q3Tried}
            q4={q4FamilyHistory}
            age={age}
            q5Outcome={q5Outcome}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <CostForecastScreen
            age={age}
            city={city}
            q1Mirror={q1Mirror}
            q5Outcome={q5Outcome}
            priceVariant={priceVariant}
            onComplete={onComplete}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}
