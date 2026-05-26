import type { PpQ1, PpQ5Goal } from "./hair-prophecy-static";

export type StageBucket = "EARLY" | "MID" | "MID_ADVANCED" | "ADVANCED";
export type TreatmentId =
  | "oral"
  | "topical"
  | "combination"
  | "prp"
  | "supplements"
  | "smp"
  | "transplant"
  | "hair_systems"
  | "monitoring";

export type TreatmentStatus = "POSSIBLY_RELEVANT" | "LIKELY_NOT" | "SUPPRESSED";

export interface Screen2Inputs {
  pp_q1: PpQ1;
  pp_q2_label: string;
  pp_q3_tried_labels: string[];
  pp_q4_family_history_label: string;
  pp_q5: PpQ5Goal;
  age: number;
}

export interface Screen2Row {
  tx: TreatmentId;
  label: string;
  reason?: string;
}

export interface Screen2Build {
  stage: StageBucket;
  possiblyRelevant: Screen2Row[];
  likelyNot: Screen2Row[];
  meta: {
    paddingRulesFired: string[];
    trimmedPossiblyRelevant: boolean;
    trimmedLikelyNot: boolean;
  };
}

type Q2Bucket = "<1yr" | "1-3" | "3-5" | "5-10" | "10+";
type Q4Bucket = "father" | "maternal_gf" | "both" | "brothers" | "none" | "unknown";
type Q3Tried = "finasteride" | "minoxidil" | "hims_keeps" | "supplements" | "prp" | "transplant" | "nothing";

const TREATMENT_ORDER: TreatmentId[] = [
  "oral",
  "topical",
  "combination",
  "prp",
  "supplements",
  "smp",
  "transplant",
  "hair_systems",
  "monitoring",
];

const TRIM_PRIORITY: TreatmentId[] = [
  "prp",
  "combination",
  "supplements",
  "topical",
  "oral",
];

function mapPpQ1ToStage(pp_q1: PpQ1): StageBucket {
  // Spec §2 stage buckets:
  // Early = NW I–II, Mid = NW III / III-vertex, Mid-advanced = NW IV/V, Advanced = NW VI/VII.
  if (pp_q1 === "hairline_intact" || pp_q1 === "slight_recession") return "EARLY";
  if (pp_q1 === "defined_recession" || pp_q1 === "recession_crown" || pp_q1 === "not_sure")
    return "MID";
  if (pp_q1 === "significant_loss" || pp_q1 === "heavy_loss") return "MID_ADVANCED";
  if (pp_q1 === "mostly_bald" || pp_q1 === "band_only") return "ADVANCED";
  return "MID";
}

function mapQ2LabelToBucket(label: string): Q2Bucket {
  const t = label.trim();
  if (t === "Less than a year") return "<1yr";
  if (t === "1–3 years") return "1-3";
  if (t === "3–5 years") return "3-5";
  if (t === "5–10 years") return "5-10";
  if (t === "More than 10 years") return "10+";
  return "1-3";
}

function q2AtLeast(bucket: Q2Bucket, compareTo: "5-10" | "10+"): boolean {
  const order: Record<Q2Bucket, number> = { "<1yr": 0, "1-3": 1, "3-5": 2, "5-10": 3, "10+": 4 };
  const target = compareTo === "5-10" ? 3 : 4;
  return (order[bucket] ?? 1) >= target;
}

function mapQ4LabelToBucket(label: string): Q4Bucket {
  const t = label.trim();
  if (t.startsWith("Father is bald")) return "father";
  if (t.startsWith("Mother's father")) return "maternal_gf";
  if (t === "Both") return "both";
  if (t.startsWith("Brothers are losing")) return "brothers";
  if (t.startsWith("None that I know")) return "none";
  return "unknown";
}

function mapQ3TriedLabels(labels: string[]): Set<Q3Tried> {
  const out = new Set<Q3Tried>();
  for (const raw of labels ?? []) {
    const t = (raw ?? "").trim();
    if (!t) continue;
    if (t.startsWith("Finasteride")) out.add("finasteride");
    else if (t.startsWith("Minoxidil")) out.add("minoxidil");
    else if (t.startsWith("Hims, Keeps")) out.add("hims_keeps");
    else if (t.startsWith("Nutrafol")) out.add("supplements");
    else if (t.startsWith("PRP")) out.add("prp");
    else if (t.startsWith("Hair transplant")) out.add("transplant");
    else if (t.startsWith("Nothing yet")) out.add("nothing");
  }
  return out;
}

function evaluateTreatment(
  tx: TreatmentId,
  input: Screen2Inputs,
  stage: StageBucket,
  q2: Q2Bucket,
  q3: Set<Q3Tried>,
  q4: Q4Bucket,
): { status: TreatmentStatus; label?: string; reason?: string } {
  const goal = input.pp_q5;

  if (tx === "oral") {
    const goalMismatch = goal === "camouflage";
    const allowCamouflageMaintenance = stage === "MID_ADVANCED";
    const allowAdvancedMaintenance = stage === "ADVANCED" && goal === "transplant";
    if (allowAdvancedMaintenance) {
      const triedOral = q3.has("finasteride") || q3.has("hims_keeps");
      return {
        status: "POSSIBLY_RELEVANT",
        label: triedOral ? "Advanced oral protocols (dutasteride, combinations)" : "Oral medication protocols",
      };
    }
    if (stage !== "ADVANCED" && (!goalMismatch || allowCamouflageMaintenance)) {
      const triedOral = q3.has("finasteride") || q3.has("hims_keeps");
      return {
        status: "POSSIBLY_RELEVANT",
        label: triedOral ? "Advanced oral protocols (dutasteride, combinations)" : "Oral medication protocols",
      };
    }
    if (stage === "ADVANCED") {
      return { status: "LIKELY_NOT", label: "Oral medication protocols", reason: "past medication-responsive stage" };
    }
    if (goalMismatch) {
      return { status: "LIKELY_NOT", label: "Oral medication protocols", reason: "not aligned with your goal" };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "topical") {
    const goalMismatch = goal === "camouflage";
    if (stage !== "ADVANCED" && !goalMismatch) {
      const triedTopical = q3.has("minoxidil") || q3.has("hims_keeps");
      return {
        status: "POSSIBLY_RELEVANT",
        label: triedTopical ? "Advanced topical formulations" : "Topical treatments",
      };
    }
    if (stage === "ADVANCED") {
      return { status: "LIKELY_NOT", label: "Topical treatments", reason: "past topical-responsive stage" };
    }
    if (goalMismatch) {
      return { status: "LIKELY_NOT", label: "Topical treatments", reason: "not aligned with your goal" };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "combination") {
    const goalMismatch = goal === "camouflage";
    const stageOk = stage === "MID" || stage === "MID_ADVANCED";
    if (stageOk && q2 !== "<1yr" && !goalMismatch) {
      return { status: "POSSIBLY_RELEVANT", label: "Combination protocols" };
    }
    if (stage === "EARLY" && q2 === "<1yr") {
      return {
        status: "LIKELY_NOT",
        label: "Combination protocols",
        reason: "premature stacking — start with monotherapy first",
      };
    }
    if (stage === "ADVANCED") {
      return { status: "LIKELY_NOT", label: "Combination protocols", reason: "past combination-responsive stage" };
    }
    if (goalMismatch) {
      return { status: "LIKELY_NOT", label: "Combination protocols", reason: "not aligned with your goal" };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "prp") {
    const tried = q3.has("prp");
    const label = tried ? "PRP optimization (technique-dependent)" : "PRP / regenerative";
    const goalMismatch = goal === "camouflage";
    const stageOk = stage === "EARLY" || stage === "MID";
    const goalOk = goal !== "camouflage";
    if (stage === "EARLY" && q2 === "<1yr") {
      return { status: "LIKELY_NOT", label, reason: "too early; monotherapy first" };
    }
    if (stageOk && input.age <= 45 && goalOk) {
      return { status: "POSSIBLY_RELEVANT", label };
    }
    if (stage === "MID_ADVANCED" || stage === "ADVANCED") {
      return { status: "LIKELY_NOT", label, reason: "too advanced — PRP can't revive dead follicles" };
    }
    if (input.age > 50) {
      return { status: "LIKELY_NOT", label, reason: "evidence is weakest in your age bracket" };
    }
    if (goalMismatch) {
      return { status: "LIKELY_NOT", label, reason: "not aligned with your goal" };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "supplements") {
    if (q4 === "none" || q3.has("supplements")) {
      return { status: "POSSIBLY_RELEVANT", label: "Supplements" };
    }
    if (q4 !== "unknown") {
      return {
        status: "LIKELY_NOT",
        label: "Supplements",
        reason: "only relevant for deficiency cases — your family history points to genetic",
      };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "smp") {
    const smpAdjunct = stage === "MID_ADVANCED" && q2AtLeast(q2, "5-10") && goal === "transplant";
    if (stage === "ADVANCED" || goal === "camouflage" || smpAdjunct) {
      return { status: "POSSIBLY_RELEVANT", label: "SMP" };
    }
    if (stage === "EARLY" || stage === "MID") {
      return { status: "LIKELY_NOT", label: "SMP", reason: "premature for your stage — pattern still evolving" };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "transplant") {
    const alreadyHad = q3.has("transplant");
    if (alreadyHad) {
      return { status: "POSSIBLY_RELEVANT", label: "Revision transplant evaluation" };
    }
    if (input.pp_q1 === "band_only") {
      return { status: "LIKELY_NOT", label: "Transplant", reason: "insufficient donor for meaningful restoration — SMP is the realistic path" };
    }
    const goalOk = goal === "transplant" || goal === "regrow" || goal === "not_sure";
    const stageOk = stage === "MID" || stage === "MID_ADVANCED" || stage === "ADVANCED";
    if (stage === "MID" && (q2 === "<1yr" || q2 === "1-3")) {
      return { status: "LIKELY_NOT", label: "Transplant", reason: "too early — you have donor to preserve for later" };
    }
    if (stage === "EARLY") {
      return { status: "LIKELY_NOT", label: "Transplant", reason: "too early — you have donor to preserve for later" };
    }
    if (input.age < 25) {
      return { status: "LIKELY_NOT", label: "Transplant", reason: "too young — pattern still evolving, donor preservation matters" };
    }
    if (stageOk && input.age >= 25 && goalOk) {
      return { status: "POSSIBLY_RELEVANT", label: "Transplant" };
    }
    if (goal === "stop_loss" || goal === "camouflage") {
      return { status: "LIKELY_NOT", label: "Transplant", reason: "not aligned with your stated goal" };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "hair_systems") {
    if (goal === "camouflage" || (stage === "ADVANCED" && goal === "not_sure")) {
      return { status: "POSSIBLY_RELEVANT", label: "Hair systems / camouflage" };
    }
    return { status: "SUPPRESSED" };
  }

  if (tx === "monitoring") {
    const earlyDurationOk = q2 === "<1yr" || q2 === "1-3";
    const noHistory = q3.size === 0 || q3.has("nothing");
    if (stage === "EARLY" && earlyDurationOk && noHistory) {
      return { status: "POSSIBLY_RELEVANT", label: "Preventive monitoring protocols" };
    }
    return { status: "SUPPRESSED" };
  }

  return { status: "SUPPRESSED" };
}

function trimToFive(rows: Screen2Row[]): { rows: Screen2Row[]; trimmed: boolean } {
  if (rows.length <= 5) return { rows, trimmed: false };
  const ids = rows.map((r) => r.tx);
  const dropSet = new Set<TreatmentId>();
  for (const id of TRIM_PRIORITY) {
    if (ids.includes(id)) {
      dropSet.add(id);
      if (rows.length - dropSet.size <= 5) break;
    }
  }
  const kept = rows.filter((r) => !dropSet.has(r.tx));
  return { rows: kept.slice(0, 5), trimmed: true };
}

function trimLikelyNotToFour(rows: Screen2Row[]): { rows: Screen2Row[]; trimmed: boolean } {
  if (rows.length <= 4) return { rows, trimmed: false };
  const score = (tx: TreatmentId): number => {
    if (tx === "transplant") return 100;
    if (tx === "topical") return 85;
    if (tx === "combination") return 80;
    if (tx === "prp") return 75;
    if (tx === "supplements") return 65;
    if (tx === "smp") return 55;
    if (tx === "oral") return 45;
    if (tx === "monitoring") return 40;
    if (tx === "hair_systems") return 35;
    return 10;
  };
  const sorted = [...rows].sort((a, b) => score(b.tx) - score(a.tx));
  return { rows: sorted.slice(0, 4), trimmed: true };
}

function applyPaddingRules(
  possiblyRelevant: Screen2Row[],
  likelyNot: Screen2Row[],
  evaluated: Map<TreatmentId, { status: TreatmentStatus; label?: string; reason?: string }>,
  input: Screen2Inputs,
  stage: StageBucket,
  q4: Q4Bucket,
): { paddingRulesFired: string[] } {
  const fired: string[] = [];
  const hasTx = (id: TreatmentId) => possiblyRelevant.some((r) => r.tx === id);
  const removeFromLikelyNot = (id: TreatmentId) => {
    const idx = likelyNot.findIndex((r) => r.tx === id);
    if (idx >= 0) likelyNot.splice(idx, 1);
  };
  const promote = (id: TreatmentId, label: string, reason?: string) => {
    if (hasTx(id)) return;
    removeFromLikelyNot(id);
    possiblyRelevant.push({ tx: id, label, reason });
  };

  // §7.1: If Preventive monitoring was suppressed and stage = Early, force-enable it
  if (possiblyRelevant.length < 3 && stage === "EARLY" && !hasTx("monitoring")) {
    const ev = evaluated.get("monitoring");
    if (!ev || ev.status === "SUPPRESSED") {
      promote("monitoring", "Preventive monitoring protocols");
      fired.push("pad_force_monitoring");
    }
  }

  // §7.2: If Supplements was in LIKELY_NOT and pp_q4 = none, move it to POSSIBLY_RELEVANT
  if (possiblyRelevant.length < 3 && q4 === "none" && !hasTx("supplements")) {
    const inLikelyNot = likelyNot.some((r) => r.tx === "supplements");
    if (inLikelyNot) {
      promote("supplements", "Supplements");
      fired.push("pad_move_supplements");
    }
  }

  // §7.3: If stage = Early/Mid and PRP was suppressed (age-only suppression), promote with variant label
  if (possiblyRelevant.length < 3 && (stage === "EARLY" || stage === "MID") && !hasTx("prp")) {
    const ev = evaluated.get("prp");
    if (ev?.status === "LIKELY_NOT" && ev.reason?.includes("age bracket")) {
      promote("prp", "PRP / regenerative (evidence varies by candidate)");
      fired.push("pad_promote_prp_age");
    }
  }

  // §7.4: If still <3, surface oral & topical even if goal misalignment would normally suppress (camouflage edge)
  if (possiblyRelevant.length < 3 && input.pp_q5 === "camouflage") {
    if (possiblyRelevant.length < 3) promote("oral", "Oral medication protocols");
    if (possiblyRelevant.length < 3) promote("topical", "Topical treatments");
    if (possiblyRelevant.length >= 3) fired.push("pad_camouflage_oral_topical");
  }

  return { paddingRulesFired: fired };
}

export function buildProphecyScreen2(input: Screen2Inputs): Screen2Build {
  const stage = mapPpQ1ToStage(input.pp_q1);
  const q2 = mapQ2LabelToBucket(input.pp_q2_label);
  const q3 = mapQ3TriedLabels(input.pp_q3_tried_labels);
  const q4 = mapQ4LabelToBucket(input.pp_q4_family_history_label);

  const possiblyRelevant: Screen2Row[] = [];
  const likelyNot: Screen2Row[] = [];
  const evaluated = new Map<TreatmentId, { status: TreatmentStatus; label?: string; reason?: string }>();

  for (const tx of TREATMENT_ORDER) {
    const r = evaluateTreatment(tx, input, stage, q2, q3, q4);
    evaluated.set(tx, r);
    if (r.status === "POSSIBLY_RELEVANT" && r.label) {
      possiblyRelevant.push({ tx, label: r.label });
    } else if (r.status === "LIKELY_NOT" && r.label) {
      likelyNot.push({ tx, label: r.label, reason: r.reason });
    }
  }

  const { paddingRulesFired } = possiblyRelevant.length < 3
    ? applyPaddingRules(possiblyRelevant, likelyNot, evaluated, input, stage, q4)
    : { paddingRulesFired: [] as string[] };

  const trimmedPossibly = trimToFive(possiblyRelevant);
  const trimmedLikely = trimLikelyNotToFour(likelyNot);

  return {
    stage,
    possiblyRelevant: trimmedPossibly.rows,
    likelyNot: trimmedLikely.rows,
    meta: {
      paddingRulesFired,
      trimmedPossiblyRelevant: trimmedPossibly.trimmed,
      trimmedLikelyNot: trimmedLikely.trimmed,
    },
  };
}

