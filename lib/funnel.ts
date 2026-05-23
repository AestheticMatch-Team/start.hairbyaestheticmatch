/**
 * Handoff from this lander to the main AestheticMatch Hair funnel.

 */

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function publicFlag(name: string, defaultValue = false): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw ? TRUE_VALUES.has(raw) : defaultValue;
}

export function hairFunnelOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_HAIR_FUNNEL_ORIGIN?.trim();
  return (raw || "https://hairbyaestheticmatch.com").replace(/\/$/, "");
}

export function clickflareTrackingOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_CLICKFLARE_TRACKING_ORIGIN?.trim();
  return (raw || "https://go.consumerwatchtoday.com").replace(/\/$/, "");
}

export function landerOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_LANDER_ORIGIN?.trim();
  return (raw || "https://start.hairbyaestheticmatch.com").replace(/\/$/, "");
}

export function affiliateUtms(): Record<string, string> {
  return {
    utm_source: process.env.NEXT_PUBLIC_UTM_SOURCE?.trim() || "start",
    utm_medium: process.env.NEXT_PUBLIC_UTM_MEDIUM?.trim() || "affiliate",
    utm_campaign: process.env.NEXT_PUBLIC_UTM_CAMPAIGN?.trim() || "hair_lander",
  };
}

export function hairFunnelPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${hairFunnelOrigin()}${p}`;
}

export function shouldUseClickflareClickUrls(): boolean {
  return publicFlag("NEXT_PUBLIC_CLICKFLARE_USE_CLICK_URLS", true);
}

export function shouldLoadClickflareDirectTracking(): boolean {
  return publicFlag("NEXT_PUBLIC_CLICKFLARE_DIRECT_TRACKING", true);
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

  const params = new URLSearchParams({ ...affiliateUtms(), ...extra });
  return `${hairFunnelPath("/get-started")}?${params.toString()}`;
}
