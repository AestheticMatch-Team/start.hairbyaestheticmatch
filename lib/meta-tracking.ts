/**
 * Meta (Facebook) attribution for CAPI offline conversions.
 * Capture on first touch: fbclid from URL (?fbclid=) stored in cookie; fbp from _fbp cookie (set by Meta pixel).
 * At lead submission: prefer _fbc cookie (set by Meta Pixel) if present; else build fbc from fbclid. Store fbc in Monday.
 */

const FBCLID_COOKIE_NAME = "fbclid";
const FBC_COOKIE_NAME = "_fbc";
/** Align with Meta Pixel _fbp (~90 days) so late converters still get attribution. */
const FBCLID_COOKIE_EXPIRY_DAYS = 90;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export interface MetaClickIds {
  fbclid?: string;
  fbp?: string;
  /** Built at submit time: fb.1.{timestampMs}.{fbclid}. Store this in Monday. */
  fbc?: string;
}

/**
 * Store fbclid from URL in a cookie (first-touch). Call on page load so we keep it across navigation.
 */
export function captureMetaClickIds(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const fbclidFromUrl = params.get("fbclid")?.trim();
  const fbclidFromCookie = getCookie(FBCLID_COOKIE_NAME)?.trim();
  const fbclid = fbclidFromUrl || fbclidFromCookie || undefined;

  if (fbclidFromUrl && !fbclidFromCookie) {
    setCookie(FBCLID_COOKIE_NAME, fbclidFromUrl, FBCLID_COOKIE_EXPIRY_DAYS);
  }

  if (fbclid) {
    const fbcExisting = getCookie(FBC_COOKIE_NAME)?.trim();
    if (!fbcExisting) {
      const fallbackFbc = `fb.1.${Date.now()}.${fbclid}`;
      setCookie(FBC_COOKIE_NAME, fallbackFbc, FBCLID_COOKIE_EXPIRY_DAYS);
    }
  }
}

/**
 * Get Meta attribution and fbc at submit time. Meta prefers the original _fbc cookie (set by Meta Pixel).
 * 1. Check _fbc cookie first → use it if present.
 * 2. Else build fbc from fbclid: fb.1.{timestampMs}.{fbclid}.
 */
export function getMetaClickIds(): MetaClickIds {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fbclidFromUrl = params.get("fbclid")?.trim();
  const fbclid = fbclidFromUrl || getCookie(FBCLID_COOKIE_NAME)?.trim() || undefined;
  const fbp = getCookie("_fbp")?.trim() || undefined;
  const fbcFromCookie = getCookie(FBC_COOKIE_NAME)?.trim();
  let fbc =
    fbcFromCookie && fbcFromCookie.startsWith("fb.1.")
      ? fbcFromCookie
      : undefined;

  if (!fbc && fbclid) {
    fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbclid, fbp, fbc };
}
