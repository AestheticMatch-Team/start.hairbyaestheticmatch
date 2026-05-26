/**
 * Reddit attribution for Conversions API — dataLayer `rdt_cid` / `rdt_uuid` for Stape/GTM.
 */

const RDT_CID_COOKIE_NAME = "rdt_cid";
const RDT_UUID_COOKIE_NAME = "_rdt_uuid";
const RDT_CID_COOKIE_EXPIRY_DAYS = 90;

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

export interface RedditClickIds {
  rdt_cid?: string;
  rdt_uuid?: string;
}

export function captureRedditClickIds(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const rdtCidFromUrl = params.get("rdt_cid")?.trim();
  if (!rdtCidFromUrl) return;
  const existing = getCookie(RDT_CID_COOKIE_NAME)?.trim();
  if (existing) return;
  setCookie(RDT_CID_COOKIE_NAME, rdtCidFromUrl, RDT_CID_COOKIE_EXPIRY_DAYS);
}

export function getRedditClickIds(): RedditClickIds {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const rdtCidFromUrl = params.get("rdt_cid")?.trim();
  const rdtCidFromCookie = getCookie(RDT_CID_COOKIE_NAME)?.trim();
  const rdt_cid = rdtCidFromUrl || rdtCidFromCookie || undefined;
  const rdt_uuid = getCookie(RDT_UUID_COOKIE_NAME)?.trim() || undefined;
  return { rdt_cid, rdt_uuid };
}
