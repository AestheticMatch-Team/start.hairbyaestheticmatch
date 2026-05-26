export type HairSettingsTabId = "account" | "password" | "billing" | "photos";

export const HAIR_SETTINGS_TABS: { id: HairSettingsTabId; label: string }[] = [
  { id: "account", label: "Account Info" },
  { id: "password", label: "Password & Security" },
  { id: "billing", label: "Billing" },
  { id: "photos", label: "My Photos" },
];

export const HAIR_SETTINGS_PHOTO_SLOTS = [
  {
    id: "front",
    title: "Front view",
    description: "Face forward, neutral expression",
    defaultUploaded: true,
  },
  {
    id: "left",
    title: "Profile — Left",
    description: "Turn head 90° to the left",
    defaultUploaded: false,
  },
  {
    id: "right",
    title: "Profile — Right",
    description: "Turn head 90° to the right",
    defaultUploaded: false,
  },
  {
    id: "angle45",
    title: "45° angle",
    description: "Turn head 45°, chin slightly down",
    defaultUploaded: false,
  },
] as const;

export function parseHairSettingsTabParam(raw: string | undefined): HairSettingsTabId {
  if (!raw?.trim()) return "account";
  const t = raw.trim().toLowerCase();
  const allowed: HairSettingsTabId[] = ["account", "password", "billing", "photos"];
  return (allowed as string[]).includes(t) ? (t as HairSettingsTabId) : "account";
}

export const HAIR_SETTINGS_AMOUNT_MASKED = "• • • • •";

export const HAIR_SETTINGS_CANCEL_MEMBERSHIP_MAILTO =
  "mailto:concierge@aestheticmatch.com?subject=Cancel%20Membership%20Request";
