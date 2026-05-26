/**
 * Hair Prophecy Screens 1 & 3 — static v3.0 logic (band-based follicles + cost).

 */

export type HairLossBand = "EARLY" | "MID" | "ADVANCED";

/** Canonical pp_q1 keys from the spec (quiz labels map into these). */
export type PpQ1 =
  | "hairline_intact"
  | "slight_recession"
  | "defined_recession"
  | "recession_crown"
  | "significant_loss"
  | "heavy_loss"
  | "mostly_bald"
  | "band_only"
  | "not_sure";

export type PpQ5Goal =
  | "stop_loss"
  | "regrow"
  | "camouflage"
  | "transplant"
  | "not_sure";

const Q1_MIRROR_TO_PP_Q1: Record<string, PpQ1> = {
  "Hairline mostly intact — barely noticeable change": "hairline_intact",
  "Slight recession at the temples": "slight_recession",
  "Defined recession — the M shape forming": "defined_recession",
  "Recession + thinning at the crown": "recession_crown",
  "Significant loss on top, sides still strong": "significant_loss",
  "Mostly bald on top, hair around the back and sides": "mostly_bald",
  "Just a band of hair around the back and sides": "band_only",
  "Honestly not sure — that's part of why I'm here": "not_sure",
};

const Q5_OUTCOME_TO_GOAL: Record<string, PpQ5Goal> = {
  "Stop the loss — keep what I have": "stop_loss",
  "Regrow what I've lost": "regrow",
  "Camouflage / cover what's gone (SMP, hair systems)": "camouflage",
  "Get a transplant — I want it handled": "transplant",
  "Honestly not sure — I want to know what's possible": "not_sure",
};

/** Maps quiz Q1 display copy → pp_q1. Unknown / empty → not_sure (MID). */
export function mirrorLabelToPpQ1(q1Mirror: string): PpQ1 {
  if (!q1Mirror.trim()) return "not_sure";
  return Q1_MIRROR_TO_PP_Q1[q1Mirror] ?? "not_sure";
}

/** Maps quiz Q5 display copy → goal key. Unknown → not_sure. */
export function outcomeLabelToPpQ5(q5Outcome: string): PpQ5Goal {
  if (!q5Outcome.trim()) return "not_sure";
  return Q5_OUTCOME_TO_GOAL[q5Outcome] ?? "not_sure";
}

export function getBand(pp_q1: PpQ1): HairLossBand {
  const early: PpQ1[] = ["hairline_intact", "slight_recession"];
  const mid: PpQ1[] = ["defined_recession", "recession_crown", "significant_loss"];
  const advanced: PpQ1[] = ["heavy_loss", "mostly_bald", "band_only"];
  if (early.includes(pp_q1)) return "EARLY";
  if (advanced.includes(pp_q1)) return "ADVANCED";
  if (mid.includes(pp_q1)) return "MID";
  return "MID";
}

/** Fixed stage captions under the three trajectory images (same for all users). */
export const STATIC_TRAJECTORY_STAGE_LABELS = [
  "Recession + thinning crown",
  "Significant loss on top",
  "Mostly bald on top",
] as const;

export const STATIC_TRAJECTORY_NOTE =
  "Based on your family history and how long you've been losing.";

/** Spec §2.1 — always 18 months (not derived from Q2). */
export const STATIC_DEADLINE_MONTHS = 18;

export const FOLLICLE_COUNTS: Record<HairLossBand, number> = {
  EARLY: 5000,
  MID: 8000,
  ADVANCED: 4000,
};

export interface CostVariant {
  without: number;
  with: number;
  savings: number;
  narrative: string;
}

export const COST_VARIANTS: Record<HairLossBand, CostVariant> = {
  EARLY: {
    without: 11000,
    with: 3400,
    savings: 7600,
    narrative:
      "2 years of Hims/Keeps + supplements that don't move the needle + eventual capitulation to surgery.",
  },
  MID: {
    without: 14200,
    with: 4800,
    savings: 9400,
    narrative:
      "2 years of Hims/Keeps that don't address your case + ineffective PRP + eventual transplant after damage is permanent.",
  },
  ADVANCED: {
    without: 22000,
    with: 9000,
    savings: 13000,
    narrative:
      "Oversold transplant + eventual SMP fallback + years of treatments that couldn't help at this stage.",
  },
};

export const STARTING_POSITION_LABELS: Record<PpQ1, string> = {
  hairline_intact: "Early Stage",
  slight_recession: "Temple Recession",
  defined_recession: "Defined Recession",
  recession_crown: "Starting Position",
  significant_loss: "Significant Loss",
  heavy_loss: "Significant Loss",
  mostly_bald: "Advanced Loss",
  band_only: "Late Stage",
  not_sure: "Starting Position",
};

export const GOAL_LABELS: Record<PpQ5Goal, string> = {
  stop_loss: "Hold the Line",
  regrow: "Regrowth Goal",
  camouflage: "Camouflage Path",
  transplant: "Transplant Goal",
  not_sure: "Exploring Options",
};

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function parseQuizAge(age: string): number {
  const n = parseInt(age, 10);
  if (Number.isFinite(n) && n >= 18 && n <= 99) return n;
  return 32;
}

export interface Screen1Render {
  band: HairLossBand;
  age_now: number;
  age_plus5: number;
  age_plus10: number;
  follicles_display: string;
}

export function renderScreen1(input: { pp_q1: PpQ1; age: number }): Screen1Render {
  const band = getBand(input.pp_q1);
  const age_now = Math.min(99, Math.max(18, Math.round(input.age)));
  const count = FOLLICLE_COUNTS[band];
  return {
    band,
    age_now,
    age_plus5: age_now + 5,
    age_plus10: age_now + 10,
    follicles_display: `~${count.toLocaleString("en-US")}`,
  };
}

export interface Screen3Render {
  band: HairLossBand;
  without_display: string;
  with_display: string;
  savings_display: string;
  savings_number: number;
  narrative: string;
  pill: string;
}

export function renderScreen3(input: {
  pp_q1: PpQ1;
  pp_q5: PpQ5Goal;
  age: number;
  city: string;
}): Screen3Render {
  const band = getBand(input.pp_q1);
  const v = COST_VARIANTS[band];
  const age = Math.min(99, Math.max(18, Math.round(input.age)));
  const city = input.city.trim() || "your area";
  const position = STARTING_POSITION_LABELS[input.pp_q1];
  const goal = GOAL_LABELS[input.pp_q5];
  const pill = `${position} · Age ${age} · ${city} · ${goal}`;

  return {
    band,
    without_display: formatUsd(v.without),
    with_display: formatUsd(v.with),
    savings_display: formatUsd(v.savings),
    savings_number: v.savings,
    narrative: v.narrative,
    pill,
  };
}

/** §4 regression checks — throws if output drifts from the shipping spec. */
export function verifyHairProphecyStaticSpec(): void {
  type Case = {
    name: string;
    pp_q1: PpQ1;
    pp_q5: PpQ5Goal;
    age: number;
    city: string;
    expectBand: HairLossBand;
    expectFollicles: string;
    expectWithout: string;
    expectWith: string;
    expectSavings: string;
    expectPill: string;
  };

  const cases: Case[] = [
    {
      name: "§4.1 EARLY",
      pp_q1: "slight_recession",
      pp_q5: "stop_loss",
      age: 27,
      city: "Austin",
      expectBand: "EARLY",
      expectFollicles: "~5,000",
      expectWithout: "$11,000",
      expectWith: "$3,400",
      expectSavings: "$7,600",
      expectPill: "Temple Recession · Age 27 · Austin · Hold the Line",
    },
    {
      name: "§4.2 MID (regression)",
      pp_q1: "recession_crown",
      pp_q5: "transplant",
      age: 32,
      city: "Dallas",
      expectBand: "MID",
      expectFollicles: "~8,000",
      expectWithout: "$14,200",
      expectWith: "$4,800",
      expectSavings: "$9,400",
      expectPill: "Starting Position · Age 32 · Dallas · Transplant Goal",
    },
    {
      name: "§4.3 ADVANCED",
      pp_q1: "mostly_bald",
      pp_q5: "transplant",
      age: 52,
      city: "Houston",
      expectBand: "ADVANCED",
      expectFollicles: "~4,000",
      expectWithout: "$22,000",
      expectWith: "$9,000",
      expectSavings: "$13,000",
      expectPill: "Advanced Loss · Age 52 · Houston · Transplant Goal",
    },
    {
      name: "§4.4 not_sure default MID",
      pp_q1: "not_sure",
      pp_q5: "not_sure",
      age: 30,
      city: "NYC",
      expectBand: "MID",
      expectFollicles: "~8,000",
      expectWithout: "$14,200",
      expectWith: "$4,800",
      expectSavings: "$9,400",
      expectPill: "Starting Position · Age 30 · NYC · Exploring Options",
    },
  ];

  for (const c of cases) {
    const s1 = renderScreen1({ pp_q1: c.pp_q1, age: c.age });
    const s3 = renderScreen3({
      pp_q1: c.pp_q1,
      pp_q5: c.pp_q5,
      age: c.age,
      city: c.city,
    });

    const assert = (cond: boolean, msg: string) => {
      if (!cond) throw new Error(`[${c.name}] ${msg}`);
    };

    assert(s1.band === c.expectBand, `band want ${c.expectBand} got ${s1.band}`);
    assert(
      s1.follicles_display === c.expectFollicles,
      `follicles want ${c.expectFollicles} got ${s1.follicles_display}`,
    );
    assert(s3.band === c.expectBand, `screen3 band want ${c.expectBand} got ${s3.band}`);
    assert(
      s3.without_display === c.expectWithout,
      `without want ${c.expectWithout} got ${s3.without_display}`,
    );
    assert(s3.with_display === c.expectWith, `with want ${c.expectWith} got ${s3.with_display}`);
    assert(
      s3.savings_display === c.expectSavings,
      `savings want ${c.expectSavings} got ${s3.savings_display}`,
    );
    assert(s3.pill === c.expectPill, `pill want "${c.expectPill}" got "${s3.pill}"`);
  }
}
