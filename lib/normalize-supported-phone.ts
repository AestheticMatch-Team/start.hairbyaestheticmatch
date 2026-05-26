/**
 * US (+1), Turkey (+90), India (+91) — must stay aligned with
 * aestheticmatchfinal `app/api/paywall-signup/route.ts` `normalizePhone`.
 */
export function normalizeSupportedPhone(phone: string): string | null {
  if (!phone || !phone.trim()) return null;
  const p = phone.trim();
  const digits = p.replace(/\D/g, "");
  if (p.startsWith("+")) {
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
    if (digits.length === 12 && digits.startsWith("90")) return `+${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    return null;
  }
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.startsWith("90") && digits.length === 12) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+90${digits.substring(1)}`;
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  return null;
}
