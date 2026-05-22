/**
 * Handoff from this lander to the main AestheticMatch Hair funnel.

 */

export function hairFunnelOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_HAIR_FUNNEL_ORIGIN?.trim();
  return (raw || "https://hairbyaestheticmatch.com").replace(/\/$/, "");
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

export function hairGetStartedUrl(extra?: Record<string, string>): string {
  const params = new URLSearchParams({ ...affiliateUtms(), ...extra });
  return `${hairFunnelPath("/get-started")}?${params.toString()}`;
}
