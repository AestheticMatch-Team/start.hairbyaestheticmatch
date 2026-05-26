"use client";

/**
 * Hair post-paywall quiz flow.
 * Spec: AestheticMatch_Hair_Complete_Quiz_v6.1 + Mapping v1.2.
 * Figma anchors (MCP-Access ZXs0A2OcqRWN0uzcPGw7VV, node tree 879:*):
 *   D1 single-select cards .............. Q1   (879:1513)
 *   D2 multi-select checkboxes .......... Q2   (879:1554)
 *   D3 stacked labeled sub-sections ..... Q3   (879:1616)
 *   D4 textarea + counter (+banner) ..... Q8   (879:1691)
 *   D5 single + conditional textarea .... Q12  (879:1724)
 *   D6 multi expandable + "+N more" ..... Q13  (879:1772)
 *   D7 numbered cards (ladder) .......... Q26  (879:1972)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { trackOpsEvent } from "@/lib/track-ops-event";
import { getMetaClickIds } from "@/lib/meta-tracking";
import { getTikTokClickIds } from "@/lib/tiktok-tracking";
import { getRedditClickIds } from "@/lib/reddit-tracking";
import { withClientNetworkContext } from "@/lib/client-network-context";
import {
  buildMetaEventUserData,
  splitFullNameToMetaFields,
} from "@/lib/meta-event-user-data";
import { funnelStepHref } from "@/lib/funnel";
import { pushToDataLayer } from "@/lib/gtm-tracking";
import {
  HAIR_POST_QUIZ_TOTAL,
  isPostQuizQuestionVisible,
  type HairPostQuizAnswers,
} from "@/lib/hair-post-quiz-answers";
import {
  QUESTIONS,
  type Option,
  type PrefillDefault,
  type QuestionDef,
} from "./questions";
import styles from "./hair-post-quiz.module.scss";
import Link from "next/link";

// Maps pre-quiz q3_tried label strings to post-quiz treatment option values.
const PP_TREATMENT_MAP: Record<string, string[]> = {
  "Finasteride (oral or topical)": ["finasteride_oral"],
  "Hims, Keeps, or similar subscription service": ["finasteride_oral", "minoxidil_topical"],
  "Minoxidil / Rogaine": ["minoxidil_topical"],
  "Nutrafol or other supplements": ["supplement"],
  "PRP injections": ["prp"],
  "Hair transplant (FUE or FUT)": ["hair_transplant"],
  "Nothing yet — still figuring out what to do": ["none"],
};

// ─── Icons ────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 6l2.5 2.5L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5M12 8v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GenderFemale() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 14v7M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GenderMale() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10" cy="14" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 10l6-6M15 4h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OptionIcon({ name }: { name?: "female" | "male" }) {
  if (name === "female") return <GenderFemale />;
  if (name === "male") return <GenderMale />;
  return null;
}

// ─── Shell ────────────────────────────────────────────────────────────────

function Shell({
  visibleStep,
  visibleTotal,
  onBack,
  children,
}: {
  visibleStep: number;
  visibleTotal: number;
  onBack: () => void;
  children: React.ReactNode;
}) {
  const filled = Math.min(visibleTotal, Math.max(0, visibleStep + 1));
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link href="/" className={styles.wordmark}>AestheticMatch Hair</Link>

      </header>
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <button type="button" className={styles.back} onClick={onBack}>
            <ChevronLeft />
            Back
          </button>
          <span className={styles.qLabel}>Question {filled}</span>
          <span className={styles.topbarSpacer} aria-hidden />
          <div className={styles.progressRow}>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={filled}
              aria-valuemin={0}
              aria-valuemax={visibleTotal}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${(filled / visibleTotal) * 100}%` }}
              />
            </div>
            <span className={styles.progressCount}>{filled}/{visibleTotal}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Heading + Pre-fill note ──────────────────────────────────────────────

function Heading({ prompt, sub }: { prompt: string; sub?: string }) {
  return (
    <>
      <h1 className={styles.qTitle}>{prompt}</h1>
      {sub ? <p className={styles.qSub}>{sub}</p> : null}
    </>
  );
}

function PrefillNote() {
  return (
    <p className={styles.prefillNote}>
      Based on your earlier answers — adjust if needed.
    </p>
  );
}

// ─── Renderers ────────────────────────────────────────────────────────────

function SingleRenderer({
  q,
  value,
  followupValue,
  showPrefillNote,
  onChange,
  onFollowupChange,
}: {
  q: Extract<QuestionDef, { type: "single" }>;
  value: string;
  followupValue: string;
  showPrefillNote: boolean;
  onChange: (v: string) => void;
  onFollowupChange: (v: string) => void;
}) {
  const showFollowup = q.followup && q.followup.whenValueIn.includes(value);
  const showExit = q.exitOnValue && value === q.exitOnValue.value;
  const hasIcons = q.options.some((o) => Boolean(o.icon));
  return (
    <>
      <Heading prompt={q.prompt} sub={q.sub} />
      {showPrefillNote ? <PrefillNote /> : null}
      <div className={styles.singleRowStack} role="radiogroup" aria-label={q.prompt}>
        {q.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={styles.singleRow}
              data-selected={selected}
              onClick={() => onChange(opt.value)}
            >
              {hasIcons ? (
                <span className={styles.leadingIcon}>
                  <OptionIcon name={opt.icon} />
                </span>
              ) : (
                <span className={styles.dotRadio} data-selected={selected} />
              )}
              <span className={styles.optLabel}>{opt.label}</span>
              {hasIcons ? (
                <span className={styles.trailingRadio} data-selected={selected} />
              ) : null}
            </button>
          );
        })}
      </div>
      {showExit && q.exitOnValue ? (
        <div className={styles.exitCard}>
          <h2 className={styles.exitTitle}>{q.exitOnValue.title}</h2>
          <p className={styles.exitBody}>{q.exitOnValue.body}</p>
        </div>
      ) : null}
      {showFollowup && q.followup ? (
        <div className={styles.followCard}>
          <span className={styles.followLabel}>{q.followup.label}</span>
          {q.followup.hint ? <span className={styles.followHint}>{q.followup.hint}</span> : null}
          <textarea
            className={styles.textarea}
            placeholder="Type your answer here…"
            maxLength={q.followup.maxLength ?? 400}
            value={followupValue}
            onChange={(e) => onFollowupChange(e.target.value)}
          />
          <span className={styles.charCount}>
            {followupValue.length}/{q.followup.maxLength ?? 400}
          </span>
        </div>
      ) : null}
    </>
  );
}

function MultiRenderer({
  q,
  value,
  otherText,
  showPrefillNote,
  onToggle,
  onOtherChange,
}: {
  q: Extract<QuestionDef, { type: "multi" }>;
  value: string[];
  otherText: string;
  showPrefillNote: boolean;
  onToggle: (opt: Option) => void;
  onOtherChange: (v: string) => void;
}) {
  const otherChecked = value.includes("other");
  const cap = q.maxSelections;
  const atCap = typeof cap === "number" && value.length >= cap;
  return (
    <>
      <Heading prompt={q.prompt} sub={q.sub} />
      {showPrefillNote ? <PrefillNote /> : null}
      <div className={styles.optionsCard} role="group" aria-label={q.prompt}>
        {q.options.map((opt) => {
          const selected = value.includes(opt.value);
          // Cap greys out unchecked non-exclusive options. Exclusive options stay clickable
          // so the user can flip into "None"/"Not sure yet" without un-checking first.
          const disabled = atCap && !selected && !opt.exclusive;
          return (
            <button
              key={opt.value}
              type="button"
              role="checkbox"
              aria-checked={selected}
              aria-disabled={disabled}
              className={styles.option}
              data-selected={selected}
              data-disabled={disabled}
              disabled={disabled}
              onClick={() => onToggle(opt)}
            >
              <span className={styles.optIndicatorCheck} data-selected={selected}>
                {selected ? <CheckIcon /> : null}
              </span>
              <span className={styles.optLabel}>{opt.label}</span>
            </button>
          );
        })}
      </div>
      {q.allowOther && otherChecked ? (
        <div className={styles.followCard}>
          <span className={styles.followLabel}>Please specify</span>
          <textarea
            className={styles.textarea}
            placeholder="Type here…"
            maxLength={200}
            value={otherText}
            onChange={(e) => onOtherChange(e.target.value)}
          />
        </div>
      ) : null}
    </>
  );
}

function MultiSectionRenderer({
  q,
  value,
  onChange,
}: {
  q: Extract<QuestionDef, { type: "multiSection" }>;
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  return (
    <>
      <Heading prompt={q.prompt} sub={q.sub} />
      <div className={styles.sectionCard}>
        {q.sections.map((sec) => {
          const current = value[sec.id] ?? "";
          return (
            <div key={sec.id} className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>{sec.label}</span>
              <div className={styles.chipRow} role="radiogroup" aria-label={sec.label}>
                {sec.options.map((opt) => {
                  const selected = current === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={styles.chip}
                      data-selected={selected}
                      onClick={() => onChange({ ...value, [sec.id]: opt.value })}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function LongTextRenderer({
  q,
  value,
  onChange,
}: {
  q: Extract<QuestionDef, { type: "longText" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <Heading prompt={q.prompt} sub={q.sub} />
      <div className={styles.textareaCard}>
        <textarea
          className={styles.textarea}
          placeholder={q.placeholder ?? "Type here…"}
          maxLength={q.maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles.charCount}>
          {value.length}/{q.maxLength}
        </span>
      </div>
      {q.banner ? (
        <div className={styles.banner}>
          <span className={styles.bannerIcon}><InfoIcon /></span>
          <span>{q.banner}</span>
        </div>
      ) : null}
    </>
  );
}

function ExpandableRenderer({
  q,
  value,
  onToggle,
}: {
  q: Extract<QuestionDef, { type: "expandable" }>;
  value: string[];
  onToggle: (opt: Option) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? q.options : q.options.slice(0, q.visibleCount);
  const hiddenCount = q.options.length - q.visibleCount;
  return (
    <>
      <Heading prompt={q.prompt} sub={q.sub} />
      <div className={styles.expandableList} role="group" aria-label={q.prompt}>
        {visible.map((opt) => {
          const selected = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              role="checkbox"
              aria-checked={selected}
              className={styles.singleRow}
              data-selected={selected}
              onClick={() => onToggle(opt)}
            >
              <span className={styles.optIndicatorCheck} data-selected={selected}>
                {selected ? <CheckIcon /> : null}
              </span>
              <span className={styles.optLabel}>{opt.label}</span>
              <span className={styles.trailingChevron} aria-hidden>
                <ChevronDown />
              </span>
            </button>
          );
        })}
        {hiddenCount > 0 ? (
          <button
            type="button"
            className={styles.expandToggle}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : `+${hiddenCount} more option${hiddenCount === 1 ? "" : "s"}`}
          </button>
        ) : null}
      </div>
    </>
  );
}

type ConnectorPath = { d: string; x1: number; y1: number; x2: number; y2: number; arrowDir: "right" | "left" };

function LadderRenderer({
  q,
  value,
  followupValue,
  onChange,
  onFollowupChange,
}: {
  q: Extract<QuestionDef, { type: "ladder" }>;
  value: string;
  followupValue: string;
  onChange: (v: string) => void;
  onFollowupChange: (v: string) => void;
}) {
  const showFollowup = q.followupOnValue && q.followupOnValue.whenValueIn.includes(value);
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>(Array(q.steps.length).fill(null));
  const [connectors, setConnectors] = useState<ConnectorPath[]>([]);

  useEffect(() => {
    function compute() {
      const outer = outerRef.current;
      if (!outer) return;
      const cr = outer.getBoundingClientRect();
      const result: ConnectorPath[] = [];

      for (let i = 0; i < q.steps.length - 1; i++) {
        const a = cardRefs.current[i];
        const b = cardRefs.current[i + 1];
        if (!a || !b) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();

        const al = ra.left - cr.left;
        const ar = ra.right - cr.left;
        const at = ra.top - cr.top;
        const ab = ra.bottom - cr.top;
        const aw = ar - al;

        // Mobile odd connectors (box2→3, box4→5) enter destination from the right side
        const isMobile = cr.width < 992;
        const enterFromRight = isMobile && i % 2 !== 0;
        const x2 = enterFromRight ? rb.right - cr.left : rb.left - cr.left;
        const y2 = (rb.top + rb.bottom) / 2 - cr.top;

        let x1: number, y1: number;

        if (cr.width >= 1119) {
          // Full desktop: specific exit points per connector
          switch (i) {
            case 0: x1 = al + aw * 0.25; y1 = ab; break; // box1: bottom at 1/4 width
            case 1: x1 = (al + ar) / 2;  y1 = at; break; // box2: top centered
            case 2: x1 = (al + ar) / 2;  y1 = ab; break; // box3: bottom centered
            case 3: x1 = al + aw / 3;    y1 = at; break; // box4: top at 1/3 width
            default: x1 = (al + ar) / 2; y1 = ab;
          }
        } else if (cr.width >= 992) {
          // Compact desktop (992–1119px): center exit, alternate top/bottom by row
          x1 = (al + ar) / 2;
          y1 = i % 2 === 0 ? ab : at;
        } else {
          // Mobile: cap offset at 16px so the dot stays near the card edge on wide screens
          const frac = Math.min(aw / 15, 16);
          x1 = i % 2 === 0 ? al + frac : ar - frac;
          y1 = ab;
        }

        // Adaptive corner radius: clamp so Q corner never overshoots past x2
        const r = Math.min(16, Math.abs(x2 - x1));

        // Vertical segment travels up or down to reach y2 level, then turns horizontal
        const vy = y2 > y1 ? y2 - r : y2 + r;
        let d: string;
        let arrowDir: "right" | "left";

        if (x1 <= x2) {
          d = [`M ${x1} ${y1}`, `V ${vy}`, `Q ${x1} ${y2} ${x1 + r} ${y2}`, `H ${x2}`].join(" ");
          arrowDir = "right";
        } else {
          d = [`M ${x1} ${y1}`, `V ${vy}`, `Q ${x1} ${y2} ${x1 - r} ${y2}`, `H ${x2}`].join(" ");
          arrowDir = "left";
        }

        result.push({ d, x1, y1, x2, y2, arrowDir });
      }
      setConnectors(result);
    }

    compute();
    const ro = new ResizeObserver(compute);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Heading prompt={q.prompt} sub={q.sub} />
      <div className={styles.ladderOuter} ref={outerRef}>
        <svg className={styles.ladderSvg} aria-hidden>
          {connectors.map((p, i) => {
            const as = 5;
            // Arrow tip at (x2,y2); base extends in opposite direction of travel
            const arrowPoints =
              p.arrowDir === "right"
                ? `${p.x2},${p.y2} ${p.x2 - as * 1.6},${p.y2 - as} ${p.x2 - as * 1.6},${p.y2 + as}`
                : `${p.x2},${p.y2} ${p.x2 + as * 1.6},${p.y2 - as} ${p.x2 + as * 1.6},${p.y2 + as}`;
            return (
              <g key={i}>
                <circle cx={p.x1} cy={p.y1} r="3.5" fill="#5A7A96" />
                <path
                  d={p.d}
                  stroke="#5A7A96"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polygon points={arrowPoints} fill="#5A7A96" />
              </g>
            );
          })}
        </svg>
        <div className={styles.ladderGrid} role="radiogroup" aria-label={q.prompt}>
          {q.steps.map((step, i) => {
            const selected = value === step.value;
            return (
              <button
                key={step.value}
                ref={(el) => { cardRefs.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={selected}
                className={styles.ladderCard}
                data-selected={selected}
                onClick={() => onChange(step.value)}
              >
                <span className={styles.ladderNum}>{i + 1}</span>
                <span className={styles.ladderTextWrap}>
                  <span className={styles.ladderLabel}>{step.label}</span>
                  <span className={styles.ladderSub}>{step.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {q.banner ? (
        <div className={styles.banner}>
          <span className={styles.bannerIcon}><InfoIcon /></span>
          <span>{q.banner}</span>
        </div>
      ) : null}
      {showFollowup && q.followupOnValue ? (
        <div className={styles.followCard}>
          <span className={styles.followLabel}>{q.followupOnValue.label}</span>
          <textarea
            className={styles.textarea}
            placeholder="Type your answer here…"
            maxLength={q.followupOnValue.maxLength}
            value={followupValue}
            onChange={(e) => onFollowupChange(e.target.value)}
          />
          <span className={styles.charCount}>
            {followupValue.length}/{q.followupOnValue.maxLength}
          </span>
        </div>
      ) : null}
    </>
  );
}

function StubRenderer({ q }: { q: Extract<QuestionDef, { type: "stub" }> }) {
  return (
    <>
      <Heading prompt={q.prompt} sub={q.sub} />
      <p className={styles.stubNote}>This step is a placeholder. Continue to advance.</p>
    </>
  );
}

// ─── Validation per question type ─────────────────────────────────────────

function canContinue(
  q: QuestionDef,
  current: { value: unknown; followup?: string },
  hairPq: Record<string, unknown>,
): boolean {
  switch (q.type) {
    case "single": {
      const v = (current.value as string) ?? "";
      if (!v) return false;
      // Female exit on Q1 — disable Continue so the user can't proceed.
      if (q.exitOnValue && v === q.exitOnValue.value) return false;
      if (q.followup && q.followup.whenValueIn.includes(v)) {
        const fu = (current.followup ?? "").trim();
        if (!fu) return false;
      }
      return true;
    }
    case "multi": {
      const arr = (current.value as string[]) ?? [];
      return arr.length > 0;
    }
    case "multiSection": {
      const m = (current.value as Record<string, string>) ?? {};
      return q.sections.every((s) => Boolean(m[s.id]));
    }
    case "longText": {
      const text = (current.value as string) ?? "";
      if (q.requiredWhen) {
        const pq = hairPq[q.requiredWhen.fromHairPq];
        const triggered =
          (typeof pq === "string" && q.requiredWhen.includesAny.includes(pq)) ||
          (Array.isArray(pq) && q.requiredWhen.includesAny.some((v) => (pq as string[]).includes(v)));
        if (triggered) return Boolean(text);
      }
      return q.optional ? true : Boolean(text);
    }
    case "expandable": {
      const arr = (current.value as string[]) ?? [];
      return arr.length > 0;
    }
    case "ladder":
      return Boolean(current.value as string);
    case "stub":
      return true;
  }
}

// ─── Main component ──────────────────────────────────────────────────────

interface Props {
  customerId: string;
  email: string;
  firstName: string;
  fullName?: string;
  phone?: string;
  savedAnswers: Partial<HairPostQuizAnswers>;
  hairPq: Record<string, unknown>;
  initialStep: number;
}

type AnswerMap = Record<string, unknown>;

export function HairPostQuizFlow({
  customerId,
  email,
  firstName,
  fullName,
  phone,
  savedAnswers,
  hairPq,
  initialStep,
}: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerMap>(() => ({ ...savedAnswers }));

  // step is an index into QUESTIONS (38; photo stub Q39 removed — finish → /post-quiz-loading).
  // hidden by `condition` — `useEffect` below snaps it to the nearest visible.
  const [step, setStep] = useState(() =>
    Math.min(QUESTIONS.length - 1, Math.max(0, initialStep ?? 0)),
  );

  // Track which question IDs got a pre-fill default this session, so we can show
  // the "Based on your earlier answers" note. Cleared if the user touches the value.
  const [prefilledIds, setPrefilledIds] = useState<Set<string>>(() => new Set());
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advancingRef = useRef(false);

  const viewedSent = useRef(false);
  useEffect(() => {
    if (!customerId || viewedSent.current) return;
    viewedSent.current = true;
    void trackOpsEvent(
      { eventType: "hair_post_quiz_viewed", customerId, email },
      { keepalive: true },
    );
  }, [customerId, email]);

  const scrollTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }),
    [],
  );

  const pushToDL = useCallback((payload: Record<string, any>) => {
    pushToDataLayer(payload);
  }, []);

  const stepRef = useRef(0);
  stepRef.current = step;
  const qRef = useRef(QUESTIONS[step]);
  qRef.current = QUESTIONS[step];

  const trackEvent = useCallback(
    (eventName: string, detail: Record<string, any>) => {
      const current = qRef.current;
      pushToDL({
        event: eventName,
        quiz_name: "hair_post_quiz",
        step_key: current?.id,
        step_index: stepRef.current + 1,
        ...detail,
      });
    },
    [pushToDL],
  );

  const quizStartFiredRef = useRef(false);
  useEffect(() => {
    if (quizStartFiredRef.current) return;
    if (step !== 0) return;
    quizStartFiredRef.current = true;
    trackEvent("hair_quiz_start", {});
  }, [trackEvent, step]);

  // Send the FULL accumulated answer set on every save, not just the current
  // question. This makes the route's read-modify-write race condition harmless
  // (a clobbering write still carries past answers forward) and lets Monday's
  // transient 423 lock errors self-heal on the next save.
  const persist = useCallback(
    (fullAnswers: AnswerMap, lastStep: number, completed?: boolean) => {
      if (!customerId) return;
      fetch("/api/hair/save-post-quiz-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          answers: fullAnswers,
          last_step: lastStep,
          ...(completed ? { completed: true } : {}),
        }),
        keepalive: true,
      }).catch(() => {});
    },
    [customerId],
  );

  // Skip-to-visible whenever step lands on a hidden question (e.g. resuming
  // on a question whose condition isn't satisfied).
  useEffect(() => {
    const q = QUESTIONS[step];
    if (isPostQuizQuestionVisible(q, answers, hairPq)) return;
    // walk forward
    let i = step + 1;
    while (i < QUESTIONS.length && !isPostQuizQuestionVisible(QUESTIONS[i], answers, hairPq)) {
      i++;
    }
    if (i < QUESTIONS.length) setStep(i);
    // If everything ahead is hidden, leave step where it is — defensive.
  }, [step, answers, hairPq]);

  // Apply pre-fill default the first time a user lands on a question with one,
  // provided no answer exists yet.
  useEffect(() => {
    const q = QUESTIONS[step];

    // Expandable Q13: pre-check treatments from pp_q3_tried labels.
    if (q.type === "expandable" && q.prefillFromHairPq) {
      const pqVal = hairPq[q.prefillFromHairPq];
      const tried = Array.isArray(pqVal) ? (pqVal as string[]) : [];
      const existing = answers[q.id];
      const isBlank = !Array.isArray(existing) || (existing as string[]).length === 0;
      if (isBlank && tried.length > 0) {
        const defaultValues = tried.flatMap((t) => PP_TREATMENT_MAP[t] ?? []);
        const unique = [...new Set(defaultValues)];
        if (unique.length > 0) {
          setAnswers((prev) => ({ ...prev, [q.id]: unique }));
          setPrefilledIds((prev) => {
            const next = new Set(prev);
            next.add(q.id);
            return next;
          });
        }
      }
      return;
    }

    const prefill = getPrefillForQuestion(q);
    if (!prefill) return;
    const pqVal = hairPq[prefill.fromHairPq];
    const mapKey = typeof pqVal === "string" ? pqVal : null;
    if (!mapKey || !(mapKey in prefill.map)) return;
    const existing = answers[q.id];
    const isBlank =
      existing === undefined ||
      existing === null ||
      existing === "" ||
      (Array.isArray(existing) && existing.length === 0) ||
      (typeof existing === "object" && !Array.isArray(existing) &&
        Object.keys(existing as Record<string, unknown>).length === 0);
    if (!isBlank) return;
    const defaultValue = prefill.map[mapKey];
    setAnswers((prev) => ({ ...prev, [q.id]: defaultValue }));
    setPrefilledIds((prev) => {
      const next = new Set(prev);
      next.add(q.id);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const q = QUESTIONS[step];
  const currentValue = coerceValueForType(answers[q.id], q);
  const followupKey = `${q.id}__followup`;
  const otherKey = `${q.id}__other`;

  const setCurrent = useCallback(
    (v: unknown) => {
      trackEvent("hair_quiz_option_select", { option: v });
      setAnswers((prev) => ({ ...prev, [q.id]: v }));
      setPrefilledIds((prev) => {
        if (!prev.has(q.id)) return prev;
        const next = new Set(prev);
        next.delete(q.id);
        return next;
      });
    },
    [q.id, trackEvent],
  );

  // Multi-toggle with exclusive + cap awareness.
  const toggleMulti = useCallback(
    (opt: Option, cap?: number) => {
      trackEvent("hair_quiz_option_select", { option: opt.value });
      setAnswers((prev) => {
        const raw = prev[q.id];
        const arr = Array.isArray(raw)
          ? (raw as string[])
          : raw && typeof raw === "object" && Array.isArray((raw as { values?: unknown }).values)
            ? ((raw as { values: string[] }).values)
            : [];
        const already = arr.includes(opt.value);

        if (already) {
          return { ...prev, [q.id]: arr.filter((x) => x !== opt.value) };
        }
        // Selecting an exclusive option clears everything else.
        if (opt.exclusive) {
          return { ...prev, [q.id]: [opt.value] };
        }
        // Selecting a non-exclusive option clears any currently-selected exclusive.
        const cleaned = arr.filter((v) => {
          const o = (q.type === "multi" ? q.options : []).find((x) => x.value === v);
          return !(o && o.exclusive);
        });
        if (typeof cap === "number" && cleaned.length >= cap) return prev;
        return { ...prev, [q.id]: [...cleaned, opt.value] };
      });
      setPrefilledIds((prev) => {
        if (!prev.has(q.id)) return prev;
        const next = new Set(prev);
        next.delete(q.id);
        return next;
      });
    },
    [q, trackEvent],
  );

  // Expandable behaves like a basic multi (no cap, no exclusive in this iteration,
  // but TREATMENTS_OPTIONS has "none" marked exclusive — honor it).
  const toggleExpandable = useCallback(
    (opt: Option) => {
      trackEvent("hair_quiz_option_select", { option: opt.value });
      setAnswers((prev) => {
        const raw = prev[q.id];
        const arr = Array.isArray(raw)
          ? (raw as string[])
          : raw && typeof raw === "object" && Array.isArray((raw as { values?: unknown }).values)
            ? ((raw as { values: string[] }).values)
            : [];
        const already = arr.includes(opt.value);
        if (already) return { ...prev, [q.id]: arr.filter((x) => x !== opt.value) };
        if (opt.exclusive) return { ...prev, [q.id]: [opt.value] };
        const cleaned = arr.filter((v) => {
          const o = (q.type === "expandable" ? q.options : []).find((x) => x.value === v);
          return !(o && o.exclusive);
        });
        return { ...prev, [q.id]: [...cleaned, opt.value] };
      });
    },
    [q, trackEvent],
  );

  const advance = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setIsAdvancing(true);

    // Find next visible step.
    let next = step + 1;
    while (next < QUESTIONS.length && !isPostQuizQuestionVisible(QUESTIONS[next], answers, hairPq)) {
      next++;
    }
    const cappedNext = Math.min(QUESTIONS.length - 1, next);

    const fullAnswers = buildFullPersistedAnswers(answers, q, currentValue);
    const isFinal = next >= QUESTIONS.length;
    persist(fullAnswers, cappedNext, isFinal);

    void trackOpsEvent(
      {
        eventType: "hair_post_quiz_qs_answered",
        customerId,
        email,
        metadata: {
          step_key: `hair_post_quiz_${q.id}`,
          step_question_preview: q.prompt.slice(0, 30),
        },
      },
      { keepalive: true },
    );

    trackEvent("hair_quiz_step_complete", { step: q.id });

    if (isFinal) {
      void trackOpsEvent(
        { eventType: "hair_post_quiz_completed", customerId, email },
        { keepalive: true },
      );
      void (async () => {
        if (typeof window === "undefined") return;
        const { fbc, fbp } = getMetaClickIds();
        const { ttclid, ttp } = getTikTokClickIds();
        const { rdt_cid, rdt_uuid } = getRedditClickIds();
        const { fn, ln } = splitFullNameToMetaFields(fullName || firstName);
        const user_data = await buildMetaEventUserData(
          withClientNetworkContext({
            em: email,
            ph: phone,
            fn,
            ln,
            external_id: customerId,
            fbc,
            fbp,
            ttclid,
            ttp,
            rdt_cid,
            rdt_uuid,
          }),
        );
        pushToDataLayer({
          event: "hair_quiz_complete",
          quiz_name: "hair_post_quiz",
          external_id: customerId,
          value: 10,
          currency: "USD",
          ...(Object.keys(user_data).length > 0 ? { user_data } : {}),
        });
      })().catch((error) => {
        console.error("[GTM] Failed to push hair_quiz_complete user_data:", error);
        pushToDataLayer({
          event: "hair_quiz_complete",
          quiz_name: "hair_post_quiz",
          external_id: customerId,
          value: 10,
          currency: "USD",
        });
      });
      router.replace(funnelStepHref("/post-quiz-loading"));
      return;
    }
    setStep(cappedNext);
    scrollTop();
    advancingRef.current = false;
    setIsAdvancing(false);
  }, [step, q, answers, currentValue, persist, scrollTop, customerId, email, firstName, fullName, phone, hairPq, router, trackEvent]);

  const goBack = useCallback(() => {
    if (step === 0) {
      trackEvent("hair_quiz_step_back", { step: q.id });
      router.push("/");
      return;
    }
    let prev = step - 1;
    while (prev >= 0 && !isPostQuizQuestionVisible(QUESTIONS[prev], answers, hairPq)) {
      prev--;
    }
    trackEvent("hair_quiz_step_back", { step: q.id });
    if (prev < 0) {
      router.push(funnelStepHref("/post-checkout"));
      return;
    }
    setStep(prev);
    scrollTop();
  }, [step, q, router, scrollTop, answers, hairPq, trackEvent]);

  const followupForValid =
    q.type === "single" && q.followup ? readFollowup(answers, q, followupKey) : undefined;
  const valid = canContinue(q, { value: currentValue, followup: followupForValid }, hairPq);

  // Compute visible step indices for the user's current condition state.
  const { visibleStep, visibleTotal } = computeVisibleProgress(step, answers, hairPq);

  const showPrefillNote = prefilledIds.has(q.id);

  const tightMobileViewport =
    q.id === "q2_ethnicity" ||
    q.id === "q3_hair" ||
    q.id === "q19_lab_status";

  const denseMultiSection = q.id === "q19_lab_status";

  const questionContent = (
    <>
      {q.type === "single" && (
        <SingleRenderer
          q={q}
          value={(currentValue as string) ?? ""}
          followupValue={readFollowup(answers, q, followupKey)}
          showPrefillNote={showPrefillNote}
          onChange={(v) => setCurrent(v)}
          onFollowupChange={(v) =>
            setAnswers((prev) => ({ ...prev, [followupKey]: v }))
          }
        />
      )}
      {q.type === "multi" && (
        <MultiRenderer
          q={q}
          value={(currentValue as string[]) ?? []}
          otherText={readOther(answers, q, otherKey)}
          showPrefillNote={showPrefillNote}
          onToggle={(opt) => toggleMulti(opt, q.maxSelections)}
          onOtherChange={(v) =>
            setAnswers((prev) => ({ ...prev, [otherKey]: v }))
          }
        />
      )}
      {q.type === "multiSection" && (
        <MultiSectionRenderer
          q={q}
          value={(currentValue as Record<string, string>) ?? {}}
          onChange={(next) => setCurrent(next)}
        />
      )}
      {q.type === "longText" && (
        <LongTextRenderer
          q={q}
          value={(currentValue as string) ?? ""}
          onChange={(v) => setCurrent(v)}
        />
      )}
      {q.type === "expandable" && (
        <ExpandableRenderer
          q={withDynamicSub(q, hairPq)}
          value={(currentValue as string[]) ?? []}
          onToggle={toggleExpandable}
        />
      )}
      {q.type === "ladder" && (
        <LadderRenderer
          q={q}
          value={(currentValue as string) ?? ""}
          followupValue={readLadderFollowup(answers, q)}
          onChange={(v) => setCurrent(v)}
          onFollowupChange={(v) => {
            const fid = q.followupOnValue?.id;
            if (!fid) return;
            setAnswers((prev) => ({ ...prev, [`${q.id}__${fid}`]: v }));
          }}
        />
      )}
      {q.type === "stub" && <StubRenderer q={q} />}
    </>
  );

  return (
    <Shell visibleStep={visibleStep} visibleTotal={visibleTotal} onBack={goBack}>
      <div
        className={clsx(
          styles.body,
          tightMobileViewport && styles.bodyTightMobile,
          denseMultiSection && styles.bodyTightMobileMultiSectionDense,
        )}
      >
        {tightMobileViewport ? (
          <div className={styles.bodyTightMobileMain}>{questionContent}</div>
        ) : (
          questionContent
        )}
        <div className={styles.actionWrap}>
          <button
            type="button"
            className={clsx(styles.continue, isAdvancing && styles.continueBusy)}
            disabled={!valid || isAdvancing}
            aria-busy={isAdvancing}
            onClick={advance}
          >
            {isAdvancing ? "Continuing…" : "Continue →"}
          </button>
        </div>
      </div>
    </Shell>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function defaultValueFor(q: QuestionDef): unknown {
  switch (q.type) {
    case "single":
    case "longText":
    case "ladder":
    case "stub":
      return "";
    case "multi":
    case "expandable":
      return [];
    case "multiSection":
      return {};
  }
}

function coerceValueForType(raw: unknown, q: QuestionDef): unknown {
  if (raw === undefined || raw === null) return defaultValueFor(q);
  switch (q.type) {
    case "multi":
    case "expandable": {
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === "object" && Array.isArray((raw as { values?: unknown }).values)) {
        return (raw as { values: string[] }).values;
      }
      return [];
    }
    case "single": {
      if (typeof raw === "string") return raw;
      if (raw && typeof raw === "object" && typeof (raw as { answer?: unknown }).answer === "string") {
        return (raw as { answer: string }).answer;
      }
      return "";
    }
    case "longText":
    case "ladder":
    case "stub":
      return typeof raw === "string" ? raw : "";
    case "multiSection":
      return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  }
}

function readFollowup(answers: AnswerMap, q: QuestionDef, followupKey: string): string {
  if (q.type === "single" && q.followup) {
    const stored = answers[q.id];
    if (stored && typeof stored === "object") {
      const fromObj = (stored as Record<string, unknown>)[q.followup.id];
      if (typeof fromObj === "string") return fromObj;
    }
  }
  const flat = answers[followupKey];
  return typeof flat === "string" ? flat : "";
}

function readOther(answers: AnswerMap, q: QuestionDef, otherKey: string): string {
  if (q.type === "multi" && q.allowOther) {
    const stored = answers[q.id];
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      const fromObj = (stored as { other?: unknown }).other;
      if (typeof fromObj === "string") return fromObj;
    }
  }
  const flat = answers[otherKey];
  return typeof flat === "string" ? flat : "";
}

function readLadderFollowup(answers: AnswerMap, q: Extract<QuestionDef, { type: "ladder" }>): string {
  if (!q.followupOnValue) return "";
  const flat = answers[`${q.id}__${q.followupOnValue.id}`];
  return typeof flat === "string" ? flat : "";
}

function buildPersistedValue(
  q: QuestionDef,
  answers: AnswerMap,
  currentValue: unknown,
): unknown {
  if (q.type === "single" && q.followup) {
    const v = (currentValue as string) ?? "";
    const followup = (answers[`${q.id}__followup`] as string) ?? "";
    return q.followup.whenValueIn.includes(v)
      ? { answer: v, [q.followup.id]: followup }
      : { answer: v };
  }
  if (q.type === "multi" && q.allowOther) {
    const arr = (currentValue as string[]) ?? [];
    const otherText = (answers[`${q.id}__other`] as string) ?? "";
    return arr.includes("other") ? { values: arr, other: otherText } : { values: arr };
  }
  if (q.type === "ladder" && q.followupOnValue) {
    const v = (currentValue as string) ?? "";
    const followup = (answers[`${q.id}__${q.followupOnValue.id}`] as string) ?? "";
    return q.followupOnValue.whenValueIn.includes(v)
      ? { value: v, [q.followupOnValue.id]: followup }
      : { value: v };
  }
  return currentValue;
}

/**
 * For Q13 (treatments tried), replace the static sub with a dynamic line that
 * names the items the user already told us in pre-quiz Q3. Falls through
 * untouched for every other expandable question.
 */
function withDynamicSub(
  q: Extract<QuestionDef, { type: "expandable" }>,
  hairPq: Record<string, unknown>,
): Extract<QuestionDef, { type: "expandable" }> {
  if (q.id !== "q13_treatments_tried") return q;
  const tried = hairPq.q3_tried;
  if (!Array.isArray(tried) || tried.length === 0) return q;
  const list = (tried as unknown[]).filter((x) => typeof x === "string").join(", ");
  if (!list) return q;
  return { ...q, sub: `You told us you've tried ${list}. Confirm and add anything else.` };
}

function isEmptyPersistedValue(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === "string" && v === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  if (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0) return true;
  return false;
}

/**
 * Build a snapshot of every answered question in its persisted form.
 * Used by `advance()` to send the full accumulated state on every save —
 * makes the route's read-modify-write race harmless and lets Monday's
 * transient lock errors heal on the next save.
 */
function buildFullPersistedAnswers(
  answers: AnswerMap,
  currentQ: QuestionDef,
  currentValue: unknown,
): AnswerMap {
  const out: AnswerMap = {};
  for (const qDef of QUESTIONS) {
    let v: unknown;
    if (qDef.id === currentQ.id) {
      v = buildPersistedValue(currentQ, answers, currentValue);
    } else {
      const raw = answers[qDef.id];
      if (raw === undefined || raw === null) continue;
      v = buildPersistedValue(qDef, answers, coerceValueForType(raw, qDef));
    }
    if (!isEmptyPersistedValue(v)) out[qDef.id] = v;
  }
  return out;
}

function getPrefillForQuestion(q: QuestionDef): PrefillDefault | undefined {
  if (q.type === "single" || q.type === "multi") return q.prefillDefault;
  return undefined;
}

function computeVisibleProgress(
  step: number,
  answers: AnswerMap,
  hairPq: Record<string, unknown>,
): { visibleStep: number; visibleTotal: number } {
  let visibleTotal = 0;
  let visibleStep = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const visible = isPostQuizQuestionVisible(QUESTIONS[i], answers, hairPq);
    if (visible) visibleTotal++;
    if (i < step && visible) visibleStep++;
  }
  // Cap at total - 1 so the indicator never overflows.
  visibleStep = Math.min(visibleStep, Math.max(0, visibleTotal - 1));
  return { visibleStep, visibleTotal: Math.max(visibleTotal, 1) };
}

// Re-export to preserve original module surface (page-level imports etc.).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _TOTAL_REF = HAIR_POST_QUIZ_TOTAL;
