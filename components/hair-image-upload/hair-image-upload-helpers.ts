import type { HairImageSlotConfig, SlotUploadState } from "./hair-image-upload-shared";

/** Blob or remote URL for UI preview (empty string ignored until fetch fills URL). */
export function getHairSlotPreviewUrl(st: SlotUploadState): string | null {
  if (st.status === "uploading" || st.status === "done") {
    const p = st.preview?.trim();
    return p ? p : null;
  }
  return null;
}

export function hairSlotReviewCaption(config: HairImageSlotConfig): string {
  return config.reviewCaption;
}
