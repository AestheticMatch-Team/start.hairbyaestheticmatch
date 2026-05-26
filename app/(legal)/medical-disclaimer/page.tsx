import type { Metadata } from "next";
import MedicalDisclaimerClient from "./MedicalDisclaimerClient";

export const metadata: Metadata = {
  title: "Medical Disclaimer | AestheticMatch Hair",
  robots: "noindex, follow",
};

export default function MedicalDisclaimerPage() {
  return <MedicalDisclaimerClient />;
}
