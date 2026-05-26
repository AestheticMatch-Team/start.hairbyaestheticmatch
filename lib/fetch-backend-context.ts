import { cookies } from "next/headers";
import { resolveBackendOrigin } from "@/lib/resolve-backend-origin";

/** Server-side fetch to main hair backend (session cookies forwarded). */
export async function fetchBackendJson<T>(path: string): Promise<T | null> {
  const origin = resolveBackendOrigin();
  if (!origin) return null;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");

  try {
    const res = await fetch(`${origin}${path.startsWith("/") ? path : `/${path}`}`, {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error("[fetchBackendJson]", path, err);
    return null;
  }
}
