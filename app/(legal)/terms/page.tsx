import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions | AestheticMatch Hair",
  robots: "noindex, follow",
};

export default function TermsPage() {
  return <TermsClient />;
}
