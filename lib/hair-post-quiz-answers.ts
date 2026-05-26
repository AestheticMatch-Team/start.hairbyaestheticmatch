import type { Condition, QuestionDef } from "@/components/hair-post-quiz/questions";

export const HAIR_POST_QUIZ_NAMESPACE = "_hair_post" as const;
export const HAIR_POST_QUIZ_TOTAL = 38;

export interface HairQ3Hair {
  color?: string;
  texture?: string;
  type?: string;
}

export interface HairQ12Autoimmune {
  answer?: "yes" | "no" | "not_sure";
  condition?: string;
}

export interface HairQ14Transplant {
  when?: string;
  technique?: string;
  grafts?: string;
  satisfaction?: string;
}

export interface HairQ19LabStatus {
  ferritin?: string;
  vitd?: string;
  tsh?: string;
  testosterone?: string;
}

export type HairPostQuizValue =
  | string
  | string[]
  | HairQ3Hair
  | HairQ12Autoimmune
  | HairQ14Transplant
  | HairQ19LabStatus
  | null;

export interface HairPostQuizAnswers {
  q1_sex_at_birth?: string;
  q2_ethnicity?: string[];
  q2_ethnicity_other?: string;
  q3_hair?: HairQ3Hair;
  q4_rate?: string;
  q5_location?: string[];
  q5_location_other?: string;
  q6_shedding?: string;
  q7_triggers?: string[];
  q8_timeline_notes?: string;
  q9_father_onset?: string;
  q10_maternal_gf?: string;
  q11_brothers?: string;
  q12_autoimmune?: HairQ12Autoimmune;
  q13_treatments_tried?: string[];
  q14_transplant_detail?: HairQ14Transplant;
  q15_medications?: string;
  q16_conditions?: string[];
  q16_conditions_other?: string;
  q17_scalp?: string[];
  q18_bloodwork?: string;
  q19_lab_status?: HairQ19LabStatus;
  q20_smoking?: string;
  q21_alcohol?: string;
  q22_sleep?: string;
  q23_stress?: string;
  q24_fin_concerns?: string;
  q25_outcome?: string;
  q26_result?: string;
  q27_med_comfort?: string;
  q28_surgery_comfort?: string;
  q29_camouflage_comfort?: string;
  q30_procedures?: string[];
  q31_concerns?: string[];
  q32_budget?: string;
  q33_travel?: string;
  q34_timeline?: string;
  q35_urgency?: string;
  q35_event_detail?: string;
  q36_specialist_notes?: string;
  q37_questions?: string;
  q38_attribution?: string;
  q38_attribution_other?: string;
  last_step?: number;
  [key: string]: unknown;
}

type AnyMap = Record<string, unknown>;

/**
 * Evaluate a question's `condition` predicate. Returns true if the question should
 * be shown — i.e. it has no condition, or the condition matches the supplied
 * pre-quiz / post-quiz answer maps.
 */
export function isPostQuizQuestionVisible(
  q: QuestionDef,
  postAnswers: AnyMap,
  hairPq: AnyMap,
): boolean {
  if (!q.condition) return true;
  return evalCondition(q.condition, postAnswers, hairPq);
}

function evalCondition(c: Condition, post: AnyMap, pq: AnyMap): boolean {
  switch (c.kind) {
    case "hairPqIncludesAny": {
      const raw = pq[c.key];
      if (typeof raw === "string") return c.values.includes(raw);
      if (Array.isArray(raw)) return c.values.some((v) => raw.includes(v));
      return false;
    }
    case "hairPqEqualsAny": {
      const raw = pq[c.key];
      return typeof raw === "string" && c.values.includes(raw);
    }
    case "postIncludesAny": {
      const raw = post[c.key];
      if (typeof raw === "string") return c.values.includes(raw);
      if (Array.isArray(raw)) return c.values.some((v) => raw.includes(v));
      // Unwrap our `{ values, other }` wrapper for multi-with-other.
      if (raw && typeof raw === "object" && Array.isArray((raw as { values?: unknown }).values)) {
        const vals = (raw as { values: string[] }).values;
        return c.values.some((v) => vals.includes(v));
      }
      return false;
    }
    case "postStartsWithAny": {
      const raw = post[c.key];
      if (typeof raw !== "string") return false;
      return c.prefixes.some((p) => raw.startsWith(p));
    }
  }
}
