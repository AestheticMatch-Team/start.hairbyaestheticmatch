/**
 * Affiliate channel (start.*) — separate from ad UTMs.
 * Sent to paywall-signup / paywall-checkout as `affiliate_partner` (Monday status + Stripe metadata).
 */
export function getAffiliateAttribution(): { affiliate_partner: string } {
  const partner = process.env.NEXT_PUBLIC_AFFILIATE_PARTNER?.trim() || "start";
  return { affiliate_partner: partner };
}
