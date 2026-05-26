/**
 * Funnel URLs for the affiliate deploy — full funnel on start.* (no handoff to main hair host).
 * API/auth proxy to aestheticmatchfinal; pages and legal stay on this app.
 */

import { clickflareClickUrl, shouldUseClickflareClickUrls } from "@/lib/clickflare";

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

/** Lander CTA: ClickFlare click URL when enabled, else local get-started. */
export function hairGetStartedUrl(
  extra?: Record<string, string>,
  options?: { clickflareCtaId?: number | string },
): string {
  if (shouldUseClickflareClickUrls()) {
    return clickflareClickUrl(options?.clickflareCtaId, extra);
  }
  return getStartedHref(extra);
}
