"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { funnelStepHref } from "@/lib/funnel";
import { HairPostQuizLoading } from "./HairPostQuizLoading";

type Props = {
  identityPill: string;
};

/** Mirrors main `app/hair/post-quiz-loading/HairPostQuizLoadingPageClient.tsx`. */
export default function HairPostQuizLoadingPageClient({ identityPill }: Props) {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    router.replace(funnelStepHref("/image-upload"));
  }, [router]);

  return <HairPostQuizLoading identityPill={identityPill} onComplete={handleComplete} />;
}
