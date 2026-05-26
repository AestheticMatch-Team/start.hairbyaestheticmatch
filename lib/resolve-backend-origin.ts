/**
 * Connectable origin for server-side fetches and next.config rewrites.
 * Node cannot resolve `hair.localhost` on many macOS setups (ENOTFOUND).
 */
export function resolveBackendOrigin(raw?: string): string {
  const input = (raw ?? process.env.HAIR_BACKEND_ORIGIN ?? "").trim();
  if (!input) return "";

  try {
    const url = new URL(input.includes("://") ? input : `http://${input}`);
    const isDev = process.env.NODE_ENV !== "production";

    if (isDev && url.hostname === "hair.localhost") {
      url.hostname = "127.0.0.1";
    }
    if (
      isDev &&
      (url.hostname === "127.0.0.1" ||
        url.hostname === "localhost" ||
        url.hostname === "hair.localhost")
    ) {
      url.protocol = "http:";
    }

    return url.origin;
  } catch {
    return input.replace(/\/$/, "");
  }
}
