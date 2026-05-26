import type { ReactNode } from "react";

export const PROCEDURE = "Hair";

export type HairImageSlotId =
  | "hair_vertex"
  | "hair_frontal"
  | "hair_left_temporal"
  | "hair_right_temporal"
  | "hair_donor";

export type HairImageSlotConfig = {
  id: HairImageSlotId;
  title: string;
  introDescription: ReactNode;
  /** Step 2 (879:2394) — instruction under pose title in upload column */
  uploadInstruction: string;
  /** Step 3 (879:2488) — short line under title in review list */
  reviewCaption: string;
  variant?: "donor";
};

export const HAIR_IMAGE_SLOTS: HairImageSlotConfig[] = [
  {
    id: "hair_vertex",
    title: "Top-Down / Vertex",
    introDescription:
      "Camera above head, angled straight down at crown",
    uploadInstruction:
      "Camera held above your head, angled straight down at your crown.",
    reviewCaption: "Camera above, angled straight down at crown",
  },
  {
    id: "hair_frontal",
    title: "Frontal Hairline",
    introDescription: "Face forward, hair pushed back from forehead",
    uploadInstruction:
      "Face forward with hair pushed back from your forehead.",
    reviewCaption: "Face forward, hair pushed back from forehead",
  },
  {
    id: "hair_left_temporal",
    title: "Left Temporal",
    introDescription: (
      <>
        Turn head right to
        <br aria-hidden="true" />
        expose left temple
      </>
    ),
    uploadInstruction:
      "Turn your head right to expose your left temple.",
    reviewCaption: "Head turned right, left temple visible",
  },
  {
    id: "hair_right_temporal",
    title: "Right Temporal",
    introDescription: "Turn head left to expose right temple",
    uploadInstruction:
      "Turn your head left to expose your right temple.",
    reviewCaption: "Head turned left, right temple visible",
  },
  {
    id: "hair_donor",
    title: "Donor Area",
    variant: "donor",
    introDescription: "Back of head tilt head down, capture from above",
    uploadInstruction:
      "Tilt your head down and capture the back of your head from above.",
    reviewCaption: "Back of head, captured from above",
  },
];

export const INTRO_TIPS = [
  "Use natural lighting — avoid harsh flash or backlighting",
  "Dry hair only — no gel, mousse, or styling product",
  "Hair down and unstyled — let it sit naturally",
  "Use a plain, clear background",
  "No filters — keep the image unedited",
] as const;

export type SlotUploadState =
  | { status: "empty" }
  | { status: "uploading"; preview: string }
  | { status: "done"; preview: string; assetId?: string }
  | { status: "error"; message: string };
