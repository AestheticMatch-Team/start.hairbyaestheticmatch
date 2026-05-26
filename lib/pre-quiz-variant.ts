export const PRE_QUIZ_VARIANT_LS_KEY = "am_funnel_variant_v1";

export type PreQuizVariant = "control" | "variant";

function hashString(str: string): number {
  let h = 0;
  const s = str.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return Math.abs(h);
}

export function getPreQuizVariant(email: string): PreQuizVariant {
  const normalized = email?.trim().toLowerCase() ?? "";
  if (!normalized) return "control";
  return hashString(`pre_quiz_funnel_v1:${normalized}`) % 100 < 50
    ? "control"
    : "variant";
}

export function storePreQuizVariant(variant: PreQuizVariant): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRE_QUIZ_VARIANT_LS_KEY, variant);
}
