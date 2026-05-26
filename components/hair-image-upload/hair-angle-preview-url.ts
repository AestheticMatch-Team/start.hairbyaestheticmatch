/** Local preview URLs for angle uploads (`<img>` / Next Image cannot render HEIF/HEIC in most Chromium builds). */

const HEIF_EXT_RE = /\.hei[cf]$/i;

export function looksLikeHeifOrHeic(file: File): boolean {
  if (/^\s*image\/hei[cf]/i.test(file.type.trim())) return true;
  return HEIF_EXT_RE.test(file.name);
}

/** Accept picker/drop uploads we allow on the angle form (MIME or known Apple container ext). */
export function isHairAngleImagePick(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  if (HEIF_EXT_RE.test(file.name)) return true;
  /** Some browsers leave type empty on macOS picker for HEIC */
  return Boolean(file.type === "" && HEIF_EXT_RE.test(file.name));
}

/**
 * For UI preview only (original file is still posted to the API).
 * Converts HEIF/HEIC to JPEG blob URL — dynamic import avoids loading WASM on every visit.
 */
export async function createHairAnglePreviewObjectUrl(file: File): Promise<string> {
  if (!looksLikeHeifOrHeic(file)) {
    return URL.createObjectURL(file);
  }

  try {
    const { default: heic2any } = await import("heic2any");
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.88 });
    const blob = Array.isArray(out) ? out[0] : out;
    return URL.createObjectURL(blob as Blob);
  } catch {
    return URL.createObjectURL(file);
  }
}
