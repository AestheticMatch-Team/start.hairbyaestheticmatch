const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function publicFlag(name: string, defaultValue = false): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw ? TRUE_VALUES.has(raw) : defaultValue;
}

export function clickflareTrackingOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_CLICKFLARE_TRACKING_ORIGIN?.trim();
  return (raw || "https://go.consumerwatchtoday.com").replace(/\/$/, "");
}

export function shouldUseClickflareClickUrls(): boolean {
  return !publicFlag("NEXT_PUBLIC_CLICKFLARE_DISABLED", false);
}

export function shouldLoadClickflareDirectTracking(): boolean {
  return !publicFlag("NEXT_PUBLIC_CLICKFLARE_DISABLED", false);
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
