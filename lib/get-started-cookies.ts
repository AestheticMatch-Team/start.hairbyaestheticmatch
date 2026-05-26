export type HairPriceVariantCookie = 149 | 79;

export function readHairPriceVariantCookie(): HairPriceVariantCookie | undefined {
  if (typeof document === "undefined") return undefined;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const p = part.trim();
    if (p.startsWith("am_hair_price_variant=")) {
      const v = decodeURIComponent(p.slice("am_hair_price_variant=".length)).trim();
      if (v === "79") return 79;
      if (v === "149") return 149;
    }
  }
  return undefined;
}
