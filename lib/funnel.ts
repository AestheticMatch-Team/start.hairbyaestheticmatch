/**
 * Funnel URLs for the affiliate deploy — full funnel on start.* (no handoff to main hair host).
 * API/auth proxy to aestheticmatchfinal; pages and legal stay on this app.
 */

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function publicFlag(name: string, defaultValue = false): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw ? TRUE_VALUES.has(raw) : defaultValue;
}

export function clickflareTrackingOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_CLICKFLARE_TRACKING_ORIGIN?.trim();
  return (raw || "https://go.consumerwatchtoday.com").replace(/\/$/, "");
}

export function landerOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_LANDER_ORIGIN?.trim();
  return (raw || "https://start.hairbyaestheticmatch.com").replace(/\/$/, "");
}

export function getStartedHref(extra?: Record<string, string>): string {
  if (!extra || Object.keys(extra).length === 0) return "/get-started";
  const params = new URLSearchParams(extra);
  const qs = params.toString();
  return qs ? `/get-started?${qs}` : "/get-started";
}

/** In-funnel navigation stays on this host (middleware does not rewrite these paths). */
export function funnelStepHref(path: string, query?: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const qs = query ? (query.startsWith("?") ? query : `?${query}`) : "";
  return `${p}${qs}`;
}

export function shouldUseClickflareClickUrls(): boolean {
  return publicFlag("NEXT_PUBLIC_CLICKFLARE_USE_CLICK_URLS", false);
}

export function shouldLoadClickflareDirectTracking(): boolean {
  return publicFlag("NEXT_PUBLIC_CLICKFLARE_DIRECT_TRACKING", false);
}

export function clickflareClickUrl(
  ctaId: number | string = process.env.NEXT_PUBLIC_CLICKFLARE_CTA_ID?.trim() || "",
  extra?: Record<string, string>,
): string {
  const normalizedCtaId = String(ctaId).trim();
  const ctaPath = /^[1-9][0-9]*$/.test(normalizedCtaId) ? `/${normalizedCtaId}` : "";
  const url = new URL(`${clickflareTrackingOrigin()}/cf/click${ctaPath}`);

  Object.entries(extra || {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  return url.toString();
}

export function hairGetStartedUrl(
  extra?: Record<string, string>,
  options?: { clickflareCtaId?: number | string },
): string {
  if (shouldUseClickflareClickUrls()) {
    return clickflareClickUrl(options?.clickflareCtaId, extra);
  }
  return getStartedHref(extra);
}
