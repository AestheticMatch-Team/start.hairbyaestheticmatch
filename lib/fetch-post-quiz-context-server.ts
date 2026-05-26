import { headers } from "next/headers";
import type { PostQuizContextResponse } from "@/lib/api-client";

export type PostQuizContextServerResult =
  | ({ ok: true } & PostQuizContextResponse)
  | { ok: false; status: number };

/** Server-side bootstrap for post-quiz / post-quiz-loading (proxied to main app). */
export async function fetchPostQuizContextServer(): Promise<PostQuizContextServerResult> {
  const h = await headers();
  const host = h.get("host");
  const cookie = h.get("cookie");
  if (!host || !cookie) {
    return { ok: false, status: 401 };
  }

  const proto =
    h.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  try {
    const res = await fetch(`${proto}://${host}/api/hair/post-quiz-context`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, status: res.status };
    }
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const data = (await res.json()) as PostQuizContextResponse;
    return { ok: true, ...data };
  } catch {
    return { ok: false, status: 500 };
  }
}
