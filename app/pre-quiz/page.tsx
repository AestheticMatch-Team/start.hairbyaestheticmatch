import type { Metadata } from "next";
import { Suspense } from "react";
import HairPreQuizPageClient from "@/components/hair-pre-quiz/HairPreQuizPageClient";

export const metadata: Metadata = {
  title: "Build Your Assessment | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

export default function PreQuizPage() {
  return (
    <Suspense fallback={null}>
      <HairPreQuizPageClient />
    </Suspense>
  );
}
