/**
 * Funnel URLs for the affiliate deploy (full funnel on start.*).
 * Legal pages: `/terms`, `/privacy`, `/medical-disclaimer` on this host.
 */

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

export function funnelStepHref(path: string, query?: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const qs = query ? (query.startsWith("?") ? query : `?${query}`) : "";
  return `${p}${qs}`;
}
