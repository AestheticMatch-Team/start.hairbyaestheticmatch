import { headers } from "next/headers";
import type { GetStartedContextResponse } from "@/lib/api-client";

/** Server-side session check (proxied to main app). `. */
export async function fetchGetStartedContextServer(
  mode: "signin" | "signup",
): Promise<GetStartedContextResponse | null> {
  const h = await headers();
  const host = h.get("host");
  const cookie = h.get("cookie");
  if (!host || !cookie) {
    return { authenticated: false };
  }

  const proto =
    h.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  try {
    const res = await fetch(
      `${proto}://${host}/api/hair/get-started-context?mode=${mode}`,
      {
        headers: { cookie },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as GetStartedContextResponse;
  } catch {
    return null;
  }
}

export function normalizeRedirectPath(redirect: string): string {
  return redirect.startsWith("/") ? redirect : `/${redirect}`;
}
