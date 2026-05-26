import type { Metadata } from "next";
import { Suspense } from "react";
import HairPostQuizPageClient from "@/components/hair-post-quiz/HairPostQuizPageClient";

export const metadata: Metadata = {
  title: "Your Assessment | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

export default function PostQuizPage() {
  return (
    <Suspense fallback={null}>
      <HairPostQuizPageClient />
    </Suspense>
  );
}
