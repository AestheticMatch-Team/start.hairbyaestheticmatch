"use client";



import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HairPreQuizLoading } from "./HairPreQuizLoading";
import { HairProphecyScreens } from "./HairProphecyScreens";
import type { HairPreQuizAnswers } from "@/lib/hair-pre-quiz-answers";
import type { HairPriceVariant } from "@/lib/resolve-hair-price-variant";
import { funnelStepHref } from "@/lib/funnel";
import styles from "./hair-pre-quiz.module.scss";

// ─── Question data ────────────────────────────────────────────────────────

const Q1_OPTIONS = [
  "Hairline mostly intact — barely noticeable change",
  "Slight recession at the temples",
  "Defined recession — the M shape forming",
  "Recession + thinning at the crown",
  "Significant loss on top, sides still strong",
  "Mostly bald on top, hair around the back and sides",
  "Just a band of hair around the back and sides",
  "Honestly not sure — that's part of why I'm here",
];

const Q2_OPTIONS = [
  "Less than a year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "More than 10 years",
];

const Q3_OPTIONS = [
  "Finasteride (oral or topical)",
  "Minoxidil / Rogaine",
  "Hims, Keeps, or similar subscription service",
  "Nutrafol or other supplements",
  "PRP injections",
  "Hair transplant (FUE or FUT)",
  "Nothing yet — still figuring out what to do",
];

const Q4_OPTIONS = [
  "Father is bald or significantly thinning",
  "Mother's father is/was bald or thinning",
  "Both",
  "Brothers are losing hair",
  "None that I know of",
];

const Q5_OPTIONS = [
  "Stop the loss — keep what I have",
  "Regrow what I've lost",
  "Camouflage / cover what's gone (SMP, hair systems)",
  "Get a transplant — I want it handled",
  "Honestly not sure — I want to know what's possible",
];

// ─── Response copy ────────────────────────────────────────────────────────

const Q3_RESPONSES: Record<string, string> = {
  "Finasteride (oral or topical)":
    "Both are clinically proven. For the right cases.<br><br>The problem: most men are prescribed standard protocols without an actual diagnosis. Right molecule, wrong dose, wrong combination, wrong stage — and you stay on it for years with no real result.<br><br>Your assessment confirms whether your case responds to these molecules, what dose makes sense, and whether you should be combining them with something else. Our concierge handles the prescription and protocol setup once you have answers.",
  "Minoxidil / Rogaine":
    "Both are clinically proven. For the right cases.<br><br>The problem: most men are prescribed standard protocols without an actual diagnosis. Right molecule, wrong dose, wrong combination, wrong stage — and you stay on it for years with no real result.<br><br>Your assessment confirms whether your case responds to these molecules, what dose makes sense, and whether you should be combining them with something else. Our concierge handles the prescription and protocol setup once you have answers.",
  "Hims, Keeps, or similar subscription service":
    "Those products work — but only for the right candidate.<br><br>60% of men using Hims and Keeps aren't the right candidate for what's in those bottles, which is why they don't see results. Same active ingredients, wrong protocol for their pattern.<br><br>Your assessment tells you whether you're in the 40% these protocols actually work for, or if you're the type that needs a different approach. If it's the second, our concierge sets up the right plan.",
  "Nutrafol or other supplements":
    "Supplements are usually not the issue you think they are.<br><br>Nutrafol and similar products work on a small subset of cases — typically deficiency-driven thinning, not pattern hair loss. If your loss is genetic (which 95% of male loss is), supplements are unlikely to move the needle.<br><br>Your assessment tells you whether your loss is genetic, deficiency-driven, or something else. Then our team builds the protocol that actually addresses it.",
  "PRP injections":
    "PRP can work — but the evidence is mixed and quality varies wildly between providers.<br><br>Most clinics oversell PRP because the margins are excellent. The science says it modestly helps active hair, doesn't revive dead follicles, and requires repeat treatments to maintain results.<br><br>Your assessment tells you whether PRP makes sense as a standalone, as a combination treatment, or whether you're past the stage where it'll meaningfully help. Our concierge then matches you to providers who do it well.",
  "Hair transplant (FUE or FUT)":
    "How happy were you with the result?<br><br>Most transplant disappointments come from one of three things: poor candidate selection, undersized graft count, or inadequate donor preservation for future procedures. All of these are diagnostic failures upstream of the surgery.<br><br>Your assessment evaluates remaining donor capacity and identifies what's possible from here. Our concierge handles the matching to revision specialists if needed.",
  "Nothing yet — still figuring out what to do":
    "Then you're early enough that you have real options.<br><br>Most men who eventually get a transplant waited too long. They burned 5–10 years trying random products, lost follicles to permanent damage, and ended up with worse outcomes when they finally acted.<br><br>Your assessment tells you what to do now — before more follicles cross the threshold. Our concierge sets up whatever the right answer turns out to be.",
};

const Q4_RESPONSES: Record<string, string> = {
  "Father is bald or significantly thinning":
    "Strongest predictor of where you're headed.<br><br>If your father progressed significantly by age 50, statistically you're on a similar curve unless you intervene. If he stayed mild, you have time on your side — but only if you act before the same age he did. <br><br>Your assessment models your trajectory against your family pattern. Your concierge then handles the protocol that bends the curve.",
  "Mother's father is/was bald or thinning":
    "The maternal grandfather correlation is real but oversimplified online.<br><br>It's not just genetics from one parent. Hair loss is polygenic — multiple genes from both sides. Your maternal grandfather's pattern matters, but it's not destiny.<br><br> Your assessment accounts for both sides of your family and tells you what your specific case indicates.",
  "Both":
    "High-risk genetic profile.<br><br>When loss is on both sides, progression tends to be faster and more aggressive. The window where intervention can hold or reverse loss is narrower than for men with one- sided family history.<br><br>Your assessment tells you exactly where in that window you are right now. Time matters more for you than most.",
  "Brothers are losing hair":
    "Brothers are the closest genetic match available.<br><br>If your brothers are progressing, that's the most accurate read on your trajectory — closer even than your father's pattern, since you share more recent genetic material. <br><br>Your assessment compares your case against the typical sibling progression and builds your plan from there.",
  "None that I know of": `Then your loss may not be primarily genetic — which changes the protocol significantly. <br><br>Non-genetic loss can be driven by stress, hormonal shifts, medications, deficiencies, or autoimmune factors. The treatment pathway is completely different than for genetic male pattern loss. <br><br>Your assessment identifies the driver. Your concierge then matches you to the right protocol — not the default "finasteride for everyone" approach.`
};

const Q5_RESPONSES: Record<string, string> = {
  "Stop the loss — keep what I have":
    "Realistic and the most common goal.<br><br>Stopping progression is achievable for most men with the right protocol — but only if your follicles haven't already crossed the point where they can be saved. The longer you wait, the less you'll have to keep.<br><br>Your assessment tells you how much of your current hair is still saveable. Our concierge handles the protocol that holds it.",
  "Regrow what I've lost":
    "Possible — but only for hair that's still physiologically alive.<br><br>Most men dramatically overestimate what regrowth is achievable. Some follicles can be revived. Others can't. The difference is invisible to the naked eye but determines everything.<br><br>Your assessment maps which hair is recoverable, which isn't, and what regrowth is realistic for your case. Our concierge then sets up the protocol.",
  "Camouflage / cover what's gone (SMP, hair systems)":
    "Direct path. SMP and hair systems work — but provider selection is everything.<br><br>Bad SMP looks worse than just being bald. Bad hair systems look obvious from across the room. The difference between excellent and embarrassing is the artist or technician you choose, not the procedure itself.<br><br>Your assessment evaluates whether you're a candidate. Our concierge matches you to providers we've vetted on portfolio quality, not marketing budget.",
  "Get a transplant — I want it handled":
    "Then your most important questions are: how many grafts, from where, and by whom?<br><br>Most clinics will quote you 3,000–4,500 grafts because that's the package they sell. Your actual need might be 1,800. Or 5,500. The clinic that quotes you doesn't know — they haven't analyzed your donor capacity or planned for your future loss.<br><br>Your assessment gives you an independent graft estimate. Our concierge matches you to specialists for your specific technique and case, then handles the booking.",
  "Honestly not sure — I want to know what's possible":
    "Then you're in the right place.<br><br>Most men in your position make a decision based on the first clinic they walk into. That clinic recommends what they specialize in selling — usually a transplant when medication would have held it, or medication when transplant is now necessary.<br><br>Your assessment ranks every viable path for your specific case. Our concierge then sets up whatever the right answer turns out to be — protocol, procedure, or wait.",
};

// ─── Flow phases ──────────────────────────────────────────────────────────

type FlowPhase =
  | "setup"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "loading"
  | "prophecy";

const PHASE_FILLED: Record<FlowPhase, number> = {
  setup: 0,
  q1: 1,
  q2: 2,
  q3: 3,
  q4: 4,
  q5: 5,
  q6: 6,
  loading: 6,
  prophecy: 6,
};

const PREVIOUS_PHASE: Partial<Record<FlowPhase, FlowPhase>> = {
  q1: "setup",
  q2: "q1",
  q3: "q2",
  q4: "q3",
  q5: "q4",
  q6: "q5",
  loading: "q6",
  prophecy: "loading",
};

// ─── Icons ────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OptionCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 6l2.5 2.5L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

// ─── Shell ────────────────────────────────────────────────────────────────

function Shell({
  filled,
  onBack,
  showProgress = true,
  children,
}: {
  filled: number;
  onBack?: () => void;
  showProgress?: boolean;
  children: React.ReactNode;
}) {
  const f = Math.min(6, Math.max(0, filled));
  return (
    <div className={styles.hpqPage}>
      <header className={styles.hpqNav}>
        <span className={styles.hpqWordmark}>AestheticMatch Hair</span>
      </header>
      <div className={styles.hpqShell}>
        {showProgress ? (
          <div className={styles.hpqTopbar}>
            {onBack ? (
              <button type="button" className={styles.hpqBack} onClick={onBack}>
                <ChevronLeft />
                Back
              </button>
            ) : (
              <span className={styles.hpqBackSpacer} aria-hidden />
            )}
            <div
              className={styles.hpqProgress}
              role="progressbar"
              aria-valuenow={f}
              aria-valuemin={0}
              aria-valuemax={6}
              aria-valuetext={`${f} of 6`}
            >
              <div
                className={styles.hpqProgressFill}
                style={{ width: `${(f / 6) * 100}%` }}
              />
            </div>
            <span className={styles.hpqBackSpacer} aria-hidden />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

// ─── Option row ───────────────────────────────────────────────────────────

function OptionRow({
  label,
  selected,
  onClick,
  multiSelect,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        styles.hpqOption,
        multiSelect ? styles.hpqOptionMulti : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      aria-pressed={multiSelect ? selected : undefined}
      aria-checked={selected}
      role={multiSelect ? "checkbox" : "radio"}
    >
      <span className={styles.hpqOptionIndicator} data-selected={selected}>
        {selected ? <OptionCheckIcon /> : null}
      </span>
      <span className={styles.hpqOptionLabel}>{label}</span>
    </button>
  );
}

// ─── Sub-screens ──────────────────────────────────────────────────────────

function SetupScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className={styles.hpqSetup}>
      <div className={styles.hpqSetupInner}>
        <div className={styles.hpqSetupCluster}>
          <h1 className={styles.hpqSetupTitle}>
            Let&apos;s Build
            <br />
            Your Assessment.
          </h1>
          <p className={styles.hpqSetupSubtitle}>
            6 questions. About 60 seconds. By the end you&apos;ll know where you stand,
            where you&apos;re headed, and what your options actually look like.
          </p>
          <div className={styles.hpqNextWrap}>
            <button
              type="button"
              className={`${styles.hpqNext} ${styles.hpqNextSetup}`}
              onClick={onBegin}
            >
              Begin →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SingleChoiceScreen({
  qNum,
  title,
  options,
  value,
  onChange,
  onNext,
  responses,
}: {
  qNum: number;
  title: React.ReactNode;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  responses?: Record<string, string>;
}) {
  const dockFeedback = !!responses;
  const responseText = value && responses ? responses[value] : "";

  const handleSelect = (opt: string) => {
    if (opt === value) return;
    onChange(opt);
  };

  const optionsCard = (
    <div className={styles.hpqOptionsCard} role="radiogroup" aria-label={String(title)}>
      {options.map((opt) => (
        <OptionRow
          key={opt}
          label={opt}
          selected={value === opt}
          onClick={() => handleSelect(opt)}
        />
      ))}
    </div>
  );

  const nextButton = (
    <div className={styles.hpqNextWrap}>
      <button type="button" className={styles.hpqNext} disabled={!value} onClick={onNext}>
        Next →
      </button>
    </div>
  );

  if (dockFeedback) {
    return (
      <div className={[styles.hpqBody, styles.hpqBodyQ3DockMobile].filter(Boolean).join(" ")}>
        <h1 className={styles.hpqQTitle}>
          Q{qNum} — {title}
        </h1>
        <div className={styles.hpqQ3ScrollRegion}>{optionsCard}</div>
        <div className={styles.hpqQ3Dock}>
          {responseText ? (
            <div className={styles.hpqFeedback} key={value}>
              {responseText.split("<br><br>").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : null}
          {nextButton}
        </div>
      </div>
    );
  }

  return (
    <div
      className={[styles.hpqBody, qNum === 1 ? styles.hpqBodyTightMobile : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <h1 className={styles.hpqQTitle}>
        Q{qNum} — {title}
      </h1>
      {optionsCard}
      {nextButton}
    </div>
  );
}

function MultiChoiceScreen({
  qNum,
  title,
  hint,
  options,
  value,
  onToggle,
  onNext,
  responses,
}: {
  qNum: number;
  title: React.ReactNode;
  hint?: string;
  options: string[];
  value: string[];
  onToggle: (v: string) => void;
  onNext: () => void;
  responses?: Record<string, string>;
}) {
  const lastSelected = value[value.length - 1];
  const responseText =
    responses && lastSelected ? responses[lastSelected] ?? "" : "";

  return (
    <div
      className={[
        styles.hpqBody,
        qNum === 3 ? styles.hpqBodyQ3DockMobile : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h1 className={styles.hpqQTitle}>
        Q{qNum} — {title}
      </h1>
      {hint ? <p className={styles.hpqQHint}>{hint}</p> : null}
      <div className={styles.hpqQ3ScrollRegion}>
        <div className={styles.hpqOptionsCard} role="group" aria-label={String(title)}>
          {options.map((opt) => (
            <OptionRow
              key={opt}
              label={opt}
              selected={value.includes(opt)}
              onClick={() => onToggle(opt)}
              multiSelect
            />
          ))}
        </div>
      </div>
      <div className={styles.hpqQ3Dock}>
        {responseText ? (
          <div className={styles.hpqFeedback} key={lastSelected}>
            {responseText.split("<br><br>").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : null}
        <div className={styles.hpqNextWrap}>
          <button
            type="button"
            className={styles.hpqNext}
            disabled={value.length === 0}
            onClick={onNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function Q6Screen({
  age,
  setAge,
  city,
  setCity,
  cityInputRef,
  placesAutocompleteEnabled,
  onNext,
}: {
  age: string;
  setAge: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  cityInputRef: React.RefObject<HTMLInputElement | null>;
  placesAutocompleteEnabled: boolean;
  onNext: () => void;
}) {
  const canNext = !!age.trim() && !!city.trim();
  return (
    <div className={styles.hpqBody}>
      <h1 className={styles.hpqQTitle}>
        Q6 — What&apos;s your age and where do you live?
      </h1>
      <div className={styles.hpqFormCard}>
        <div className={styles.hpqField}>
          <label className={styles.hpqFieldLabel} htmlFor="hpq-age">Age</label>
          <div className={styles.hpqFieldInputSuffix}>
            <input
              id="hpq-age"
              className={styles.hpqFieldInput}
              type="number"
              inputMode="numeric"
              min={18}
              max={99}
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
            />
            <span className={styles.hpqSuffix}>years</span>
          </div>
        </div>
        <div className={styles.hpqField}>
          <label className={styles.hpqFieldLabel} htmlFor="hpq-city">City</label>
          <input
            ref={cityInputRef}
            id="hpq-city"
            className={styles.hpqFieldInput}
            type="text"
            placeholder={
              placesAutocompleteEnabled ? "Search your city" : "Enter your city (e.g. Austin, TX)"
            }
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="off"
            aria-label="City or location"
          />
        </div>
        <hr className={styles.hpqDivider} />
        <div className={styles.hpqNextWrap}>
          <button
            type="button"
            className={styles.hpqNext}
            disabled={!canNext}
            onClick={onNext}
          >
            Next →
          </button>
        </div>
        <div className={styles.hpqFormFoot}>
          <LockIcon />
          <span>No response is saved. Data capture only.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────

interface Props {
  firstName?: string;
  customerId?: string;
  email?: string;
  /** When set, final CTA navigates here; otherwise goes to `/hair-lander`. */
  paywallParams?: string;
  savedAnswers?: Partial<HairPreQuizAnswers>;
  /** Matches hair paywall / PaymentForm (`149` | `79`). */
  resolvedPriceVariant: HairPriceVariant;
}

export function HairPreQuizFlow({
  firstName = "",
  customerId,
  email = "",
  paywallParams,
  savedAnswers,
  resolvedPriceVariant,
}: Props) {
  const router = useRouter();
  const sa = savedAnswers ?? {};

  const [phase, setPhase] = useState<FlowPhase>(() => {
    if (sa.q6_age && sa.q6_city) return "loading";
    if (sa.q5_outcome) return "q6";
    if (sa.q4_family_history) return "q5";
    if (Array.isArray(sa.q3_tried) && sa.q3_tried.length > 0) return "q4";
    if (sa.q2_loss_duration) return "q3";
    if (sa.q1_mirror) return "q2";
    return "setup";
  });

  const [q1, setQ1] = useState(sa.q1_mirror ?? "");
  const [q2, setQ2] = useState(sa.q2_loss_duration ?? "");
  const [q3, setQ3] = useState<string[]>(Array.isArray(sa.q3_tried) ? sa.q3_tried : []);
  const [q4, setQ4] = useState(sa.q4_family_history ?? "");
  const [q5, setQ5] = useState(sa.q5_outcome ?? "");
  const [q6Age, setQ6Age] = useState(sa.q6_age ?? "");
  const [q6City, setQ6City] = useState(sa.q6_city ?? "");
  const [q6State, setQ6State] = useState(sa.q6_state ?? "");
  const [q6Zip, setQ6Zip] = useState(sa.q6_zip ?? "");

  const cityInputRef = useRef<HTMLInputElement | null>(null);
  /** Ignore one controlled-input onChange after Places selection (Google may strip ", USA"). */
  const skipNextCityInputRef = useRef(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const placesAutocompleteEnabled = mapsApiKey.length > 0;

  /** Same script id as plastics pre-quiz — one Places bundle site-wide */
  useEffect(() => {
    if (phase !== "q6" || !placesAutocompleteEnabled) return;
    const win = window as unknown as { google?: { maps?: { places?: unknown } } };
    if (mapsLoaded || win.google?.maps?.places) {
      setMapsLoaded(true);
      return;
    }
    const existing = document.getElementById("google-places-pre-quiz") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setMapsLoaded(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "google-places-pre-quiz";
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${mapsApiKey}`;
    script.async = true;
    script.onload = () => setMapsLoaded(true);
    script.onerror = () => setMapsLoaded(false);
    document.head.appendChild(script);
  }, [phase, mapsLoaded, placesAutocompleteEnabled, mapsApiKey]);

  useEffect(() => {
    const root = document.documentElement;
    if (phase === "q6") {
      root.dataset.hairPreQuizPlaces = "true";
    } else {
      delete root.dataset.hairPreQuizPlaces;
    }
    return () => {
      delete root.dataset.hairPreQuizPlaces;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "q6" || !placesAutocompleteEnabled || !mapsLoaded || !cityInputRef.current) {
      return;
    }

    type Addr = { types: string[]; long_name?: string; short_name?: string };
    type AutocompleteInstance = {
      addListener: (name: string, fn: () => void) => void;
      getPlace: () => { address_components?: Addr[] };
    };
    type MapsLike = {
      places: {
        Autocomplete: new (input: HTMLInputElement, opts: object) => AutocompleteInstance;
      };
      event: { clearInstanceListeners: (instance: AutocompleteInstance) => void };
    };

    const maps = (window as unknown as { google?: { maps?: MapsLike } }).google?.maps;
    if (!maps?.places?.Autocomplete || !maps.event) return;

    const inputEl = cityInputRef.current;
    const autocomplete = new maps.places.Autocomplete(inputEl, {
      types: ["(cities)"],
      componentRestrictions: { country: "us" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place?.address_components) return;
      const cityComp = place.address_components.find((c) => c.types.includes("locality"));
      const stateComp = place.address_components.find((c) =>
        c.types.includes("administrative_area_level_1"),
      );
      const zipComp = place.address_components.find((c) => c.types.includes("postal_code"));
      const cityName = cityComp?.long_name ?? "";
      const stateShort = stateComp?.short_name ?? "";
      if (cityName) {
        const display = stateShort
          ? `${cityName}, ${stateShort}, USA`
          : `${cityName}, USA`;
        skipNextCityInputRef.current = true;
        setQ6City(display);
      }
      if (stateShort) setQ6State(stateShort);
      setQ6Zip(zipComp?.long_name ?? "");
    });

    return () => {
      maps.event.clearInstanceListeners(autocomplete);
    };
  }, [phase, mapsLoaded, placesAutocompleteEnabled]);

  const scrollTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }),
    [],
  );

  const advanceTo = useCallback(
    (next: FlowPhase) => {
      setPhase(next);
      scrollTop();
    },
    [scrollTop],
  );

  const handleQ3Toggle = useCallback((opt: string) => {
    setQ3((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  }, []);

  const saveProgress = useCallback(() => {
    if (!customerId) return;
    const answers: HairPreQuizAnswers = {
      firstName,
      email,
      q1_mirror: q1,
      q2_loss_duration: q2,
      q3_tried: q3,
      q4_family_history: q4,
      q5_outcome: q5,
      q6_age: q6Age,
      q6_city: q6City,
      q6_state: q6State,
      q6_zip: q6Zip,
    };
    fetch("/api/hair/save-pre-quiz-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: customerId,
        answers,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [
    customerId,
    firstName,
    email,
    q1,
    q2,
    q3,
    q4,
    q5,
    q6Age,
    q6City,
    q6State,
    q6Zip,
  ]);

  const finishToLoading = useCallback(() => {
    saveProgress();
    advanceTo("loading");
  }, [advanceTo, saveProgress]);

  const handleLoadingComplete = useCallback(() => {
    advanceTo("prophecy");
  }, [advanceTo]);

  const handleProphecyComplete = useCallback(() => {
    const q = paywallParams?.trim();
    if (q) {
      window.location.href = funnelStepHref("/paywall", q);
      return;
    }
    window.location.href = funnelStepHref("/paywall");
  }, [paywallParams]);

  const goBack = useCallback(() => {
    if (phase === "setup") {
      router.push("/");
      return;
    }
    const prev = PREVIOUS_PHASE[phase];
    if (prev) advanceTo(prev);
  }, [phase, router, advanceTo]);

  const filled = PHASE_FILLED[phase] ?? 0;

  if (phase === "loading") {
    return (
      <HairPreQuizLoading
        city={q6City}
        onComplete={handleLoadingComplete}
        onBack={() => advanceTo("q6")}
      />
    );
  }

  if (phase === "prophecy") {
    return (
      <HairProphecyScreens
        firstName={firstName}
        age={q6Age}
        city={q6City}
        q1Mirror={q1}
        q2Duration={q2}
        q3Tried={q3}
        q4FamilyHistory={q4}
        q5Outcome={q5}
        priceVariant={resolvedPriceVariant}
        onComplete={handleProphecyComplete}
        onBackFromStep1={() => advanceTo("loading")}
      />
    );
  }

  return (
    <Shell filled={filled} onBack={goBack} showProgress={phase !== "setup"}>
      {phase === "setup" && <SetupScreen onBegin={() => advanceTo("q1")} />}

      {phase === "q1" && (
        <SingleChoiceScreen
          qNum={1}
          title={
            <>
              Which best matches
              <br />
              what you see in the mirror?
            </>
          }
          options={Q1_OPTIONS}
          value={q1}
          onChange={setQ1}
          onNext={() => { saveProgress(); advanceTo("q2"); }}
        />
      )}

      {phase === "q2" && (
        <SingleChoiceScreen
          qNum={2}
          title={
            <>
              How long have
              <br />
              you been losing hair?
            </>
          }
          options={Q2_OPTIONS}
          value={q2}
          onChange={setQ2}
          onNext={() => { saveProgress(); advanceTo("q3"); }}
        />
      )}

      {phase === "q3" && (
        <MultiChoiceScreen
          qNum={3}
          title={
            <>
              What have
              <br />
              you used to address it?
            </>
          }
          hint="Select all that apply."
          options={Q3_OPTIONS}
          value={q3}
          onToggle={handleQ3Toggle}
          onNext={() => { saveProgress(); advanceTo("q4"); }}
          responses={Q3_RESPONSES}
        />
      )}

      {phase === "q4" && (
        <SingleChoiceScreen
          qNum={4}
          title={<>Hair loss in your family?</>}
          options={Q4_OPTIONS}
          value={q4}
          onChange={setQ4}
          responses={Q4_RESPONSES}
          onNext={() => { saveProgress(); advanceTo("q5"); }}
        />
      )}

      {phase === "q5" && (
        <SingleChoiceScreen
          qNum={5}
          title={
            <>
              What outcome
              <br />
              are you looking for?
            </>
          }
          options={Q5_OPTIONS}
          value={q5}
          onChange={setQ5}
          responses={Q5_RESPONSES}
          onNext={() => { saveProgress(); advanceTo("q6"); }}
        />
      )}

      {phase === "q6" && (
        <Q6Screen
          age={q6Age}
          setAge={setQ6Age}
          city={q6City}
          cityInputRef={cityInputRef}
          placesAutocompleteEnabled={placesAutocompleteEnabled}
          setCity={(v) => {
            if (skipNextCityInputRef.current) {
              skipNextCityInputRef.current = false;
              return;
            }
            setQ6City(v);
            setQ6State("");
            setQ6Zip("");
          }}
          onNext={finishToLoading}
        />
      )}
    </Shell>
  );
}
