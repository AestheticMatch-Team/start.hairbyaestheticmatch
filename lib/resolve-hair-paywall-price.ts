import type { HairPriceVariant } from "./resolve-hair-price-variant";
import { resolveHairPriceVariantFromSearchParams } from "./resolve-hair-price-variant";

export function resolveHairPaywallPriceFromSearchParams(
  searchParams: URLSearchParams
): { customerId: string; email: string; priceVariant: HairPriceVariant } | null {
  const customerId = searchParams.get("customer_id")?.trim() ?? "";
  const email = searchParams.get("email")?.trim() ?? "";
  if (!customerId || !email) return null;
  return {
    customerId,
    email,
    priceVariant: resolveHairPriceVariantFromSearchParams(searchParams),
  };
}
