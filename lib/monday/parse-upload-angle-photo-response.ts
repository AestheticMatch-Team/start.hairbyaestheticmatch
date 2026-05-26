/**
 * Parse JSON body from POST /api/monday/upload-angle-photo (or empty HTML/plain from edge 413).
 */
export function parseUploadAnglePhotoBody(raw: string): Record<string, unknown> {
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function isUploadAnglePhotoSuccess(
  httpStatus: number,
  parsed: Record<string, unknown>
): parsed is { ok: true; assetId: string } {
  return (
    httpStatus >= 200 &&
    httpStatus < 300 &&
    parsed.ok === true &&
    typeof parsed.assetId === "string" &&
    parsed.assetId.length > 0
  );
}

/** Prefer `message` over machine `error`; handle empty body (e.g. platform 413). */
export function userMessageFromUploadAnglePhotoFailure(
  httpStatus: number,
  parsed: Record<string, unknown>
): string {
  const pick = (key: string): string => {
    const v = parsed[key];
    return typeof v === "string" && v.trim() ? v.trim() : "";
  };
  const fromApi =
    pick("message") || pick("mondayMessage") || pick("details") || "";
  if (fromApi) return fromApi;

  const err = pick("error");
  if (err && (err.includes(" ") || err.length > 48)) return err;

  if (httpStatus === 413) {
    return "This file is too large to upload. Try a smaller image or compress it (for example, export as JPEG under a few MB), then try again.";
  }
  if (err) return err;

  if (httpStatus >= 400) {
    return `Upload failed (HTTP ${httpStatus}).`;
  }
  return "Upload failed.";
}
