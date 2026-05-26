import type { Metadata } from "next";
import { redirect } from "next/navigation";
import HairPostQuizLoadingPageClient from "@/components/hair-post-quiz/HairPostQuizLoadingPageClient";
import { fetchPostQuizContextServer } from "@/lib/fetch-post-quiz-context-server";

export const metadata: Metadata = {
  title: "Tailoring your plan | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

export default async function PostQuizLoadingPage() {
  const ctx = await fetchPostQuizContextServer();

  if (!ctx.ok) {
    if (ctx.status === 401 || ctx.status === 403) {
      redirect("/get-started?mode=signin");
    }
  }

  const identityPill = ctx.ok ? (ctx.identityPill ?? "") : "";

  return <HairPostQuizLoadingPageClient identityPill={identityPill} />;
}
