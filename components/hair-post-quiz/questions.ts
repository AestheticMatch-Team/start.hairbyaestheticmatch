// Hair Post-Paywall Quiz — question definitions.
// Content per AestheticMatch_Hair_Complete_Quiz_v6.1 (May 4, 2026) +
// AestheticMatch_Hair_PostPaywall_Mapping_v1.2 (May 11, 2026).
// Anchor Figma designs D1–D7 live in MCP-Access ZXs0A2OcqRWN0uzcPGw7VV.

export type Option = {
  value: string;
  label: string;
  icon?: "female" | "male";
  /** "None of the above", "Prefer not to say", "Not sure yet" — clears others on select. */
  exclusive?: boolean;
};
export type Section = { id: string; label: string; options: Option[] };
export type LadderStep = { value: string; label: string; sub: string };

export type FollowupSpec = {
  /** show follow-up only when parent value matches one of these */
  whenValueIn: string[];
  id: string;
  label: string;
  hint?: string;
  maxLength?: number;
};

/**
 * Skip-this-question predicate. Evaluated against `_hair_pq` answers (pre-paywall)
 * and the in-progress `_hair_post` answer map. Falsy → question is skipped.
 */
export type Condition =
  | { kind: "hairPqIncludesAny"; key: string; values: string[] }
  | { kind: "hairPqEqualsAny"; key: string; values: string[] }
  | { kind: "postIncludesAny"; key: string; values: string[] }
  | { kind: "postStartsWithAny"; key: string; prefixes: string[] };

/**
 * Default value to apply when the user first lands on the question (answer is blank)
 * and the matching pre-quiz answer is present.
 */
export type PrefillDefault = {
  /** Key in `_hair_pq` (e.g. "q5_outcome" or "q4_family_history"). */
  fromHairPq: string;
  /** Mapping from pre-quiz value → post-quiz default. For multi questions the default is a string[]. */
  map: Record<string, string | string[]>;
};

/** Exit-the-flow card shown when the user picks a particular value (Q1 female). */
export type ExitOnValue = {
  value: string;
  title: string;
  body: string;
};

/** Conditional textarea on a ladder step (Q35 highest urgency). */
export type LadderFollowup = {
  whenValueIn: string[];
  id: string;
  label: string;
  maxLength: number;
};

export type QuestionDef =
  | {
      id: string;
      type: "single";
      prompt: string;
      sub?: string;
      options: Option[];
      followup?: FollowupSpec;
      exitOnValue?: ExitOnValue;
      prefillDefault?: PrefillDefault;
      condition?: Condition;
    }
  | {
      id: string;
      type: "multi";
      prompt: string;
      sub?: string;
      options: Option[];
      allowOther?: boolean;
      maxSelections?: number;
      prefillDefault?: PrefillDefault;
      condition?: Condition;
    }
  | {
      id: string;
      type: "multiSection";
      prompt: string;
      sub?: string;
      sections: Section[];
      condition?: Condition;
    }
  | {
      id: string;
      type: "longText";
      prompt: string;
      sub?: string;
      maxLength: number;
      optional?: boolean;
      banner?: string;
      placeholder?: string;
      /** Becomes required when this pre-quiz answer includes any of the values. */
      requiredWhen?: { fromHairPq: string; includesAny: string[] };
      condition?: Condition;
    }
  | {
      id: string;
      type: "expandable";
      prompt: string;
      sub?: string;
      options: Option[];
      visibleCount: number;
      /** key in _hair_pq to pre-check from (e.g. "q3_tried") */
      prefillFromHairPq?: string;
      condition?: Condition;
    }
  | {
      id: string;
      type: "ladder";
      prompt: string;
      sub?: string;
      steps: LadderStep[];
      banner?: string;
      followupOnValue?: LadderFollowup;
      condition?: Condition;
    }
  | {
      id: string;
      type: "stub";
      prompt: string;
      sub?: string;
      condition?: Condition;
    };

// ─── Option libraries ─────────────────────────────────────────────────────

const SEX_OPTIONS: Option[] = [
  { value: "female", label: "Female", icon: "female" },
  { value: "male", label: "Male", icon: "male" },
];

const ETHNICITY_OPTIONS: Option[] = [
  { value: "white_caucasian", label: "White / Caucasian" },
  { value: "black_african", label: "Black / African" },
  { value: "east_asian", label: "East Asian" },
  { value: "south_asian", label: "South Asian" },
  { value: "hispanic_latino", label: "Hispanic / Latino" },
  { value: "mena", label: "Middle Eastern / North African" },
  { value: "mixed", label: "Mixed" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say", exclusive: true },
];

const HAIR_COLOR_OPTIONS: Option[] = [
  { value: "blond", label: "Blond" },
  { value: "light_brown", label: "Light brown" },
  { value: "dark_brown", label: "Dark brown" },
  { value: "black", label: "Black" },
  { value: "red_auburn", label: "Red/Auburn" },
  { value: "gray_white", label: "Gray/White" },
];

const HAIR_TEXTURE_OPTIONS: Option[] = [
  { value: "fine", label: "Fine" },
  { value: "medium", label: "Medium" },
  { value: "coarse", label: "Coarse" },
];

const HAIR_TYPE_OPTIONS: Option[] = [
  { value: "straight", label: "Straight" },
  { value: "wavy", label: "Wavy" },
  { value: "curly", label: "Curly" },
  { value: "tightly_coiled", label: "Tightly coiled" },
];

const TREATMENTS_OPTIONS: Option[] = [
  { value: "finasteride_oral", label: "Finasteride (oral)" },
  { value: "dutasteride_oral", label: "Dutasteride (oral)" },
  { value: "topical_finasteride", label: "Topical finasteride" },
  { value: "minoxidil_topical", label: "Minoxidil (topical)" },
  { value: "minoxidil_oral", label: "Minoxidil (oral)" },
  { value: "microneedling", label: "Microneedling / dermaroller" },
  { value: "ketoconazole", label: "Ketoconazole shampoo (Nizoral)" },
  { value: "other_shampoos", label: "Other shampoos or topicals" },
  { value: "prp", label: "PRP / PRF injection" },
  { value: "exosome", label: "Exosome injection" },
  { value: "lllt", label: "Low-level laser therapy (cap, helmet, comb)" },
  { value: "supplement", label: "Supplement" },
  { value: "hair_transplant", label: "Hair transplant" },
  { value: "smp", label: "Scalp Micropigmentation (SMP)" },
  { value: "hair_systems", label: "Hair systems / units / pieces" },
  { value: "none", label: "None — I haven't tried anything", exclusive: true },
];

const RESULT_LADDER: LadderStep[] = [
  { value: "subtle", label: "Subtle", sub: "Nobody should be able to tell." },
  { value: "natural", label: "Natural", sub: "People notice I look better but can't pinpoint why." },
  { value: "noticeable", label: "Noticeable", sub: "A clear improvement in density." },
  { value: "full_restoration", label: "Full restoration", sub: "I want my hair to feel full again." },
  { value: "maximum_density", label: "Maximum density", sub: "As thick as possible." },
];

const URGENCY_LADDER: LadderStep[] = [
  { value: "flexible", label: "Flexible", sub: "I'll wait for the right approach." },
  { value: "somewhat_flexible", label: "Somewhat flexible", sub: "I'd prefer my timeline but can wait." },
  { value: "moderately_important", label: "Moderately important", sub: "I want to stick to my timeline." },
  { value: "important", label: "Important", sub: "I have a target window in mind." },
  { value: "very_important", label: "Very important", sub: "I have a specific event or deadline." },
];

const LAB_STATUS_OPTIONS: Option[] = [
  { value: "i_know", label: "I know my number" },
  { value: "tested_no_number", label: "Tested but don't have the number" },
  { value: "not_tested", label: "Not tested" },
];

// ─── Question list ─────────────────────────────────────────────────────────

export const QUESTIONS: QuestionDef[] = [
  // Q1 — Sex (D1 anchor)
  {
    id: "q1_sex_at_birth",
    type: "single",
    prompt: "What is your sex assigned at birth?",
    sub: "We're starting with male pattern hair loss. Female protocols are different — we'll let you know when we add them.",
    options: SEX_OPTIONS,
    exitOnValue: {
      value: "female",
      title: "Thanks for sharing.",
      body: "We're starting with male pattern hair loss. Female protocols are different and we're building them next — we'll let you know when they're ready.",
    },
  },

  // Q2 — Ethnicity (D2 anchor)
  {
    id: "q2_ethnicity",
    type: "multi",
    prompt: "How would you describe your ethnicity?",
    sub: "Hair characteristics and progression patterns vary by ethnicity. This helps us calibrate the assessment.",
    options: ETHNICITY_OPTIONS,
    allowOther: true,
  },

  // Q3 — Tell us about your hair (D3 anchor)
  {
    id: "q3_hair",
    type: "multiSection",
    prompt: "Tell us about your hair.",
    sub: "Hair characteristics and progression patterns are closely related.",
    sections: [
      { id: "color", label: "Hair Color", options: HAIR_COLOR_OPTIONS },
      { id: "texture", label: "Hair Texture", options: HAIR_TEXTURE_OPTIONS },
      { id: "type", label: "Hair Type", options: HAIR_TYPE_OPTIONS },
    ],
  },

  // Q4 — Rate of loss (D1)
  {
    id: "q4_rate",
    type: "single",
    prompt: "How would you describe the rate of loss?",
    sub: "Different rates suggest different things — and different treatment urgency.",
    options: [
      { value: "rapid", label: "Rapid and noticeable" },
      { value: "steady", label: "Steady and gradual" },
      { value: "slow", label: "Slow" },
      { value: "not_sure", label: "I'm not sure" },
    ],
  },

  // Q5 — Where you notice loss most (D2)
  {
    id: "q5_location",
    type: "multi",
    prompt: "Where do you notice the loss most?",
    sub: "Multiple selections OK if loss is in more than one area.",
    options: [
      { value: "hairline_temples", label: "Hairline / temples" },
      { value: "crown", label: "Crown" },
      { value: "mid_scalp", label: "Mid-scalp" },
      { value: "all_over", label: "All over / diffuse" },
      { value: "beard_body", label: "Beard or body hair" },
      { value: "other", label: "Other" },
    ],
    allowOther: true,
  },

  // Q6 — Shedding (D1)
  {
    id: "q6_shedding",
    type: "single",
    prompt: "Have you noticed shedding (more hair on pillow, in shower, on hands)?",
    sub: "Active shedding patterns can indicate something different from typical hair loss.",
    options: [
      { value: "yes_constantly", label: "Yes, constantly" },
      { value: "yes_episodes", label: "Yes, in episodes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },

  // Q7 — Recent triggers (D2)
  {
    id: "q7_triggers",
    type: "multi",
    prompt: "Has anything changed in the last 6–12 months that might have triggered shedding?",
    sub: "Some life events can cause temporary shedding that looks like hair loss but reverses on its own.",
    options: [
      { value: "major_stress", label: "Major stress event" },
      { value: "illness_surgery", label: "Illness or surgery" },
      { value: "covid", label: "COVID infection" },
      { value: "weight_loss", label: "Significant weight loss" },
      { value: "medication_change", label: "Started or stopped a medication" },
      { value: "dietary_change", label: "Dietary change" },
      { value: "sleep_disruption", label: "Sleep disruption" },
      { value: "none_of_the_above", label: "None of the above", exclusive: true },
    ],
  },

  // Q8 — Timeline notes (D4 anchor)
  {
    id: "q8_timeline_notes",
    type: "longText",
    prompt: "Anything else about your hair loss timeline we should know?",
    sub: "Optional — anything we didn't ask that affects how this has progressed.",
    maxLength: 400,
    optional: true,
    placeholder: "Type here…",
    banner: "This context helps our specialists see the full picture.",
  },

  // Q9 — Father's onset age (D1, CONDITIONAL on pp_q4 Father/Both)
  {
    id: "q9_father_onset",
    type: "single",
    prompt: "Father's age when his hair loss began.",
    sub: "Roughly when did your dad's hair start to thin or recede?",
    options: [
      { value: "under_25", label: "Under 25" },
      { value: "25_35", label: "25–35" },
      { value: "35_45", label: "35–45" },
      { value: "45_plus", label: "45+" },
      { value: "unknown", label: "Unknown / no significant loss" },
    ],
    condition: {
      kind: "hairPqIncludesAny",
      key: "q4_family_history",
      values: ["Father is bald or significantly thinning", "Both"],
    },
  },

  // Q10 — Maternal grandfather (D1) + pre-fill
  {
    id: "q10_maternal_gf",
    type: "single",
    prompt: "Maternal grandfather's hair pattern.",
    sub: "Your mother's father — his hair pattern is genetically significant for male pattern baldness.",
    options: [
      { value: "full_head", label: "Full head of hair" },
      { value: "mature_hairline", label: "Mature hairline only" },
      { value: "moderate_loss", label: "Moderate loss" },
      { value: "advanced_loss", label: "Advanced loss" },
      { value: "fully_bald", label: "Fully bald" },
      { value: "unknown", label: "Unknown" },
    ],
    prefillDefault: {
      fromHairPq: "q4_family_history",
      map: {
        "Mother's father is/was bald or thinning": "advanced_loss",
        "Both": "advanced_loss",
      },
    },
  },

  // Q11 — Brothers' patterns (D4) — required if pp_q4 includes "brothers"
  {
    id: "q11_brothers",
    type: "longText",
    prompt: "Brothers' hair patterns, if any.",
    sub: "Optional — if you have brothers, what does their hair look like?",
    maxLength: 300,
    optional: true,
    requiredWhen: { fromHairPq: "q4_family_history", includesAny: ["Brothers are losing hair"] },
  },

  // Q12 — Family autoimmune (D5 anchor)
  {
    id: "q12_autoimmune",
    type: "single",
    prompt: "Any family history of autoimmune conditions, thyroid disorders, or alopecia areata?",
    sub: "These can affect hair loss patterns or signal underlying conditions.",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
      { value: "not_sure", label: "Not sure" },
    ],
    followup: {
      whenValueIn: ["yes"],
      id: "condition",
      label: "Briefly, what condition?",
      hint: "Please share the specific condition.",
      maxLength: 200,
    },
  },

  // Q13 — Treatments tried (D6 anchor)
  {
    id: "q13_treatments_tried",
    type: "expandable",
    prompt: "Which of the following hair loss treatments have you tried?",
    sub: "You told us you've tried these. Confirm and add anything else.",
    options: TREATMENTS_OPTIONS,
    visibleCount: 8,
    prefillFromHairPq: "q3_tried",
  },

  // Q14 — Hair transplant detail (D3, CONDITIONAL on q13 ∋ hair_transplant) — simplified
  {
    id: "q14_transplant_detail",
    type: "multiSection",
    prompt: "Tell us about your hair transplant.",
    sub: "Even if it was years ago, it changes what's available for you now.",
    sections: [
      {
        id: "when",
        label: "When was it?",
        options: [
          { value: "lt_1_year", label: "Less than 1 year ago" },
          { value: "1_3_years", label: "1–3 years" },
          { value: "3_5_years", label: "3–5 years" },
          { value: "5_10_years", label: "5–10 years" },
          { value: "10_plus", label: "10+ years" },
        ],
      },
      {
        id: "technique",
        label: "Technique",
        options: [
          { value: "fue", label: "FUE" },
          { value: "fut", label: "FUT" },
          { value: "dhi", label: "DHI" },
          { value: "combination", label: "Combination" },
          { value: "dont_know", label: "Don't know" },
        ],
      },
      {
        id: "grafts",
        label: "Graft count",
        options: [
          { value: "under_1500", label: "Under 1,500" },
          { value: "1500_2500", label: "1,500–2,500" },
          { value: "2500_3500", label: "2,500–3,500" },
          { value: "3500_plus", label: "3,500+" },
          { value: "dont_know", label: "Don't know" },
        ],
      },
      {
        id: "satisfaction",
        label: "Satisfaction (1–10)",
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5", label: "5" },
          { value: "6", label: "6" },
          { value: "7", label: "7" },
          { value: "8", label: "8" },
          { value: "9", label: "9" },
          { value: "10", label: "10" },
        ],
      },
    ],
    condition: {
      kind: "postIncludesAny",
      key: "q13_treatments_tried",
      values: ["hair_transplant"],
    },
  },

  // Q15 — Medications (D4)
  {
    id: "q15_medications",
    type: "longText",
    prompt: "What medications are you currently taking?",
    sub: "Include all prescriptions and regular over-the-counter medications. Some affect hair growth.",
    maxLength: 500,
    optional: true,
    placeholder: "e.g., Lisinopril 10mg, Sertraline 50mg, daily aspirin",
  },

  // Q16 — Diagnosed conditions (D2)
  {
    id: "q16_conditions",
    type: "multi",
    prompt: "Have you been diagnosed with any of these conditions?",
    sub: "Several of these can cause or worsen hair loss. Your protocol will account for them.",
    options: [
      { value: "thyroid", label: "Thyroid disorder" },
      { value: "autoimmune", label: "Autoimmune condition" },
      { value: "diabetes", label: "Diabetes" },
      { value: "hypertension", label: "High blood pressure" },
      { value: "low_t", label: "Low testosterone" },
      { value: "depression_anxiety", label: "Depression / anxiety treated with medication" },
      { value: "none", label: "None", exclusive: true },
      { value: "other", label: "Other" },
    ],
    allowOther: true,
  },

  // Q17 — Scalp conditions (D2)
  {
    id: "q17_scalp",
    type: "multi",
    prompt: "Do you have any scalp conditions?",
    sub: "Some scalp conditions affect surgical planning or timing. Your specialist needs to know.",
    options: [
      { value: "psoriasis", label: "Psoriasis" },
      { value: "seborrheic_dermatitis", label: "Seborrheic dermatitis (dandruff / flaking)" },
      { value: "alopecia_areata", label: "Alopecia areata (patchy loss)" },
      { value: "scarring", label: "Scarring or scarring alopecia" },
      { value: "sensitive_scalp", label: "Sensitive or easily irritated scalp" },
      { value: "none", label: "None", exclusive: true },
    ],
  },

  // Q18 — Bloodwork (D1)
  {
    id: "q18_bloodwork",
    type: "single",
    prompt: "Have you had recent blood work done?",
    sub: "Helps us know whether to recommend baseline labs or build off what you already have.",
    options: [
      { value: "yes_6mo", label: "Yes, within last 6 months" },
      { value: "yes_year", label: "Yes, within last year" },
      { value: "yes_over_year", label: "Yes, but over a year ago" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },

  // Q19 — Lab status (D3, CONDITIONAL on q18 starts with "yes_") — simplified
  {
    id: "q19_lab_status",
    type: "multiSection",
    prompt: "Do you know your recent levels for these?",
    sub: "Pick what applies for each. Skip anything you don't remember.",
    sections: [
      { id: "ferritin", label: "Ferritin", options: LAB_STATUS_OPTIONS },
      { id: "vitd", label: "Vitamin D", options: LAB_STATUS_OPTIONS },
      { id: "tsh", label: "Thyroid (TSH)", options: LAB_STATUS_OPTIONS },
      { id: "testosterone", label: "Testosterone", options: LAB_STATUS_OPTIONS },
    ],
    condition: {
      kind: "postStartsWithAny",
      key: "q18_bloodwork",
      prefixes: ["yes_"],
    },
  },

  // Q20 — Smoking / nicotine (D1)
  {
    id: "q20_smoking",
    type: "single",
    prompt: "Do you smoke or use nicotine products?",
    sub: "Smoking significantly affects surgical outcomes — your surgeon will ask this too.",
    options: [
      { value: "current", label: "Currently smoke / use nicotine" },
      { value: "quit_lt_year", label: "Quit within the last year" },
      { value: "quit_gt_year", label: "Quit over a year ago" },
      { value: "never", label: "Never" },
    ],
  },

  // Q21 — Alcohol (D1)
  {
    id: "q21_alcohol",
    type: "single",
    prompt: "How would you describe your alcohol consumption?",
    sub: "Affects medication metabolism and overall health context.",
    options: [
      { value: "none", label: "None" },
      { value: "occasional", label: "Occasional" },
      { value: "regular", label: "Regular" },
      { value: "daily", label: "Daily" },
    ],
  },

  // Q22 — Sleep (D1)
  {
    id: "q22_sleep",
    type: "single",
    prompt: "How would you describe your sleep?",
    sub: "Sleep affects hormones that affect hair.",
    options: [
      { value: "good", label: "Consistently 7+ hours, good quality" },
      { value: "decent", label: "Decent" },
      { value: "poor", label: "Poor" },
      { value: "shift_irregular", label: "Shift work or irregular" },
    ],
  },

  // Q23 — Stress (D1)
  {
    id: "q23_stress",
    type: "single",
    prompt: "How would you describe your current stress level?",
    sub: "Stress is one of the most common reversible drivers of shedding.",
    options: [
      { value: "low", label: "Low" },
      { value: "moderate", label: "Moderate" },
      { value: "high", label: "High" },
      { value: "very_high", label: "Very high" },
    ],
  },

  // Q24 — Fin/dut concerns (D4)
  {
    id: "q24_fin_concerns",
    type: "longText",
    prompt: "Any concerns about taking finasteride or dutasteride?",
    sub: "Optional — if you've heard things about fin/dut that worry you, tell us. We'd rather address it directly.",
    maxLength: 400,
    optional: true,
  },

  // Q25 — Worth-it outcome (D4)
  {
    id: "q25_outcome",
    type: "longText",
    prompt: "In your own words, what outcome would make this worth it?",
    sub: "There are no wrong answers. Tell us what you'd want to see in the mirror.",
    maxLength: 500,
    optional: true,
    placeholder: "e.g., I want to look like myself again, or I want to stop worrying about it every morning, or I want my hairline back where it was at 25.",
  },

  // Q26 — Result you're looking for (D7 anchor)
  {
    id: "q26_result",
    type: "ladder",
    prompt: "How would you describe the result you're looking for?",
    sub: "This helps us align the analysis and visualization with your goals.",
    steps: RESULT_LADDER,
    banner:
      "Selecting a higher level with advanced hair loss and limited donor supply may create an expectation gap. We'll help set a realistic density target during your analysis.",
  },

  // Q27 — Daily medication comfort (D1)
  {
    id: "q27_med_comfort",
    type: "single",
    prompt: "How would you feel about taking a daily medication for the foreseeable future?",
    sub: "Most effective protocols include daily medication. Honest answer matters.",
    options: [
      { value: "very_comfortable", label: "Very comfortable" },
      { value: "comfortable_if_works", label: "Comfortable if it works" },
      { value: "hesitant", label: "Hesitant" },
      { value: "strongly_avoid", label: "Strongly prefer to avoid" },
    ],
  },

  // Q28 — Surgery comfort (D1) + pre-fill from pp_q5
  {
    id: "q28_surgery_comfort",
    type: "single",
    prompt: "How would you feel about a surgical procedure (hair transplant)?",
    sub: "Helps us match the recommendation to what you'd actually do.",
    options: [
      { value: "actively_considering", label: "Actively considering" },
      { value: "open_to_it", label: "Open to it" },
      { value: "last_resort", label: "Only as a last resort" },
      { value: "strongly_avoid", label: "Strongly prefer to avoid" },
    ],
    prefillDefault: {
      fromHairPq: "q5_outcome",
      map: {
        "Get a transplant — I want it handled": "actively_considering",
        "Stop the loss — keep what I have": "open_to_it",
        "Camouflage / cover what's gone (SMP, hair systems)": "strongly_avoid",
      },
    },
  },

  // Q29 — SMP / hair system comfort (D1) + pre-fill
  {
    id: "q29_camouflage_comfort",
    type: "single",
    prompt: "How would you feel about non-surgical options like SMP or a hair system?",
    sub: "For some patterns, these are the most realistic high-coverage options. We'll explain either way.",
    options: [
      { value: "open_to_either", label: "Open to either" },
      { value: "smp_yes", label: "SMP yes, system no" },
      { value: "system_yes", label: "System yes, SMP no" },
      { value: "neither", label: "Neither" },
      { value: "tell_me_more", label: "Tell me more" },
    ],
    prefillDefault: {
      fromHairPq: "q5_outcome",
      map: { "Camouflage / cover what's gone (SMP, hair systems)": "open_to_either" },
    },
  },

  // Q30 — Procedures considering (D2) + pre-fill
  {
    id: "q30_procedures",
    type: "multi",
    prompt: "Which procedure(s) are you considering?",
    sub: "What you've been considering — even if you're not sure yet, this helps focus the analysis.",
    options: [
      { value: "fue", label: "FUE Hair Transplant" },
      { value: "fut", label: "FUT / Strip Hair Transplant" },
      { value: "prp", label: "PRP Therapy" },
      { value: "smp", label: "Scalp Micropigmentation (SMP)" },
      { value: "combination", label: "Combination" },
      { value: "not_sure_yet", label: "Not sure yet", exclusive: true },
    ],
    prefillDefault: {
      fromHairPq: "q5_outcome",
      map: {
        "Get a transplant — I want it handled": ["fue"],
        "Camouflage / cover what's gone (SMP, hair systems)": ["smp"],
      },
    },
  },

  // Q31 — Biggest concerns (D2) — MAX 3
  {
    id: "q31_concerns",
    type: "multi",
    prompt: "What's your biggest concern about moving forward?",
    sub: "Select up to three. Tells us what to focus the assessment on.",
    maxSelections: 3,
    options: [
      { value: "finding_right_surgeon", label: "Finding the right surgeon" },
      { value: "cost", label: "Cost / affordability" },
      { value: "recovery_time", label: "Recovery time" },
      { value: "pain", label: "Pain" },
      { value: "results_not_meeting", label: "Results not meeting expectations" },
      { value: "donor_thinning", label: "Donor area thinning / scarring" },
      { value: "safety", label: "Safety / complications" },
      { value: "unnatural_hairline", label: "Unnatural-looking hairline" },
      { value: "results_too_slow", label: "Results taking too long to show" },
      { value: "multiple_sessions", label: "Needing multiple sessions" },
      { value: "not_sure_what_i_need", label: "Not sure what I need", exclusive: true },
    ],
  },

  // Q32 — Budget (D1)
  {
    id: "q32_budget",
    type: "single",
    prompt: "What's your realistic budget for hair restoration over the next 12 months?",
    sub: "Not a commitment — helps us focus the cost analysis. Honest budget gets you a more useful report.",
    options: [
      { value: "under_500", label: "Under $500" },
      { value: "500_2k", label: "$500–$2,000" },
      { value: "2k_5k", label: "$2,000–$5,000" },
      { value: "5k_15k", label: "$5,000–$15,000" },
      { value: "15k_plus", label: "$15,000+" },
      { value: "not_sure", label: "Not sure yet" },
    ],
  },

  // Q33 — Travel openness (D1)
  {
    id: "q33_travel",
    type: "single",
    prompt: "Are you open to traveling for treatment?",
    sub: "Some of the most experienced hair surgeons are abroad — and prices vary a lot.",
    options: [
      { value: "local_only", label: "No, local only" },
      { value: "within_country", label: "Within my country" },
      { value: "international_ok", label: "International travel okay" },
      { value: "medical_tourism", label: "Specifically interested in medical tourism (Turkey, Mexico, etc.)" },
    ],
  },

  // Q34 — Timeline (D1)
  {
    id: "q34_timeline",
    type: "single",
    prompt: "What's your timeline?",
    sub: "How quickly are you looking to act?",
    options: [
      { value: "asap", label: "I want to start ASAP" },
      { value: "within_3mo", label: "Within 3 months" },
      { value: "within_6_12mo", label: "Within 6–12 months" },
      { value: "exploring", label: "Just exploring, no rush" },
    ],
  },

  // Q35 — Urgency ladder (D7) + conditional textarea on "very_important"
  {
    id: "q35_urgency",
    type: "ladder",
    prompt: "How important is it that this happens within your stated timeline?",
    sub: "Helps us calibrate the action plan to your reality.",
    steps: URGENCY_LADDER,
    followupOnValue: {
      whenValueIn: ["very_important"],
      id: "event_detail",
      label: "Is there a specific date or event?",
      maxLength: 200,
    },
  },

  // Q36 — Anything else for specialists (D4)
  {
    id: "q36_specialist_notes",
    type: "longText",
    prompt: "Anything else you'd like our specialists to know about your situation?",
    sub: "Optional — anything we didn't ask about that affects your situation.",
    maxLength: 600,
    optional: true,
  },

  // Q37 — Specific questions for report (D4)
  {
    id: "q37_questions",
    type: "longText",
    prompt: "Any specific questions you want the report to address?",
    sub: "Optional — for example: \"Is my donor strong enough for what I want?\" or \"Should I do PRP first?\" or \"Is Turkey safe for my case?\"",
    maxLength: 500,
    optional: true,
  },

  // Q38 — How heard about us (D1)
  {
    id: "q38_attribution",
    type: "single",
    prompt: "How did you hear about us?",
    sub: "Helps us know what's working.",
    options: [
      { value: "forbes", label: "Forbes" },
      { value: "google_search", label: "Google search" },
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "youtube", label: "YouTube" },
      { value: "friend_family", label: "Friend or family" },
      { value: "other", label: "Other" },
    ],
    followup: {
      whenValueIn: ["other"],
      id: "attribution_other",
      label: "Tell us where",
      maxLength: 100,
    },
  },

];
