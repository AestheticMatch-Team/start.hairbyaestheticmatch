import { readHairPriceVariantCookie } from "./get-started-cookies";

export type HairPriceVariant = 149 | 79;

export function parseHairPriceVariant(value: string | null | undefined): HairPriceVariant | null {
  if (value === "79") return 79;
  if (value === "149") return 149;
  return null;
}

/** Client-side price for pre-quiz / prophecy (URL param, then cookie, default 149). */
export function resolveHairPriceVariantFromSearchParams(
  searchParams: URLSearchParams
): HairPriceVariant {
  const urlPv = parseHairPriceVariant(searchParams.get("price_variant"));
  if (urlPv) return urlPv;
  return readHairPriceVariantCookie() ?? 149;
}
