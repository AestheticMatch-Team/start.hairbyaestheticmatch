const CLICKFLARE_CLICK_ID_COOKIE = "cf_click_id";
const CLICKFLARE_COOKIE_EXPIRY_DAYS = 30;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    if (p.startsWith(nameEQ)) return decodeURIComponent(p.slice(nameEQ.length));
  }
  return null;
}

function firstClickIdFromParams(params: URLSearchParams): string | undefined {
  const explicit = params.get("cf_click_id")?.trim() || params.get("clickflare_click_id")?.trim();
  if (explicit) return explicit;

  const utmId = params.get("utm_id")?.trim();
  if (utmId && UUID_RE.test(utmId)) return utmId;

  const utmContent = params.get("utm_content")?.trim();
  if (utmContent && UUID_RE.test(utmContent)) return utmContent;

  return undefined;
}

export function captureClickflareAttribution(): void {
  if (typeof window === "undefined") return;
  const clickId = firstClickIdFromParams(new URLSearchParams(window.location.search));
  if (clickId) setCookie(CLICKFLARE_CLICK_ID_COOKIE, clickId, CLICKFLARE_COOKIE_EXPIRY_DAYS);
}

export function getClickflareAttribution(): { cf_click_id?: string } {
  if (typeof window === "undefined") return {};
  const fromUrl = firstClickIdFromParams(new URLSearchParams(window.location.search));
  const fromCookie = getCookie(CLICKFLARE_CLICK_ID_COOKIE)?.trim();
  const cfClickId = fromUrl || fromCookie || undefined;
  return cfClickId ? { cf_click_id: cfClickId } : {};
}
