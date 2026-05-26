const UTM_COOKIE_PREFIX = "utm_";
const UTM_COOKIE_EXPIRY_DAYS = 7;

export type UTMParameter =
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_term"
  | "utm_content";

export type UTMParams = Partial<Record<UTMParameter, string>>;

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const p = part.trim();
    if (p.startsWith(nameEQ)) {
      return decodeURIComponent(p.slice(nameEQ.length));
    }
  }
  return null;
}

export function captureUTMParams(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const keys: UTMParameter[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  for (const key of keys) {
    const value = params.get(key);
    if (value) {
      const cookieName = UTM_COOKIE_PREFIX + key.replace("utm_", "");
      if (!getCookie(cookieName)) {
        setCookie(cookieName, value, UTM_COOKIE_EXPIRY_DAYS);
      }
    }
  }
}

export function getUTMParams(preferUrlParams = true): UTMParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const stored: UTMParams = {};
  const keys: UTMParameter[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  for (const key of keys) {
    const storedVal = getCookie(UTM_COOKIE_PREFIX + key.replace("utm_", ""));
    if (storedVal) stored[key] = storedVal;
  }
  const url: UTMParams = {};
  for (const key of keys) {
    const v = params.get(key);
    if (v) url[key] = v;
  }
  return preferUrlParams ? { ...stored, ...url } : { ...url, ...stored };
}
