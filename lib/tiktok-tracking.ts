/**
 * TikTok attribution for Events API (server-side) + Pixel deduplication.
 */

const TTCLID_COOKIE_NAME = "ttclid";
const TTP_COOKIE_NAME = "_ttp";
const TTCLID_COOKIE_EXPIRY_DAYS = 395;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export interface TikTokClickIds {
  ttclid?: string;
  ttp?: string;
}

export function captureTikTokClickIds(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const ttclidFromUrl = params.get("ttclid")?.trim();
  if (!ttclidFromUrl) return;
  const existing = getCookie(TTCLID_COOKIE_NAME)?.trim();
  if (existing) return;
  setCookie(TTCLID_COOKIE_NAME, ttclidFromUrl, TTCLID_COOKIE_EXPIRY_DAYS);
}

export function getTikTokClickIds(): TikTokClickIds {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const ttclidFromUrl = params.get("ttclid")?.trim();
  const ttclidFromCookie = getCookie(TTCLID_COOKIE_NAME)?.trim();
  const ttclid = ttclidFromUrl || ttclidFromCookie || undefined;
  const ttp = getCookie(TTP_COOKIE_NAME)?.trim() || undefined;
  return { ttclid, ttp };
}
