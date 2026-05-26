import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | AestheticMatch Hair",
  robots: "noindex, follow",
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
