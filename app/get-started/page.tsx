import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import GetStartedPageClient from "@/components/get-started/GetStartedPageClient";
import { HairGetStartedNeutralLoading } from "@/components/get-started/HairGetStartedLoadingShell";
import {
  fetchGetStartedContextServer,
  normalizeRedirectPath,
} from "@/lib/get-started-server";

export const metadata: Metadata = {
  title: "Get started | AestheticMatch Hair",
  description:
    "Sign in or create your account, then continue to your hair assessment and checkout.",
  robots: "noindex, nofollow",
};

type PageProps = {
  searchParams: Promise<{
    mode?: string;
    email?: string;
  }>;
};

export default async function GetStartedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialMode = params.mode === "signin" ? "signin" : "signup";
  const emailFromQuery = typeof params.email === "string" ? params.email.trim() : "";

  const ctx = await fetchGetStartedContextServer(initialMode);
  if (ctx?.authenticated && ctx.redirect) {
    redirect(normalizeRedirectPath(ctx.redirect));
  }

  const initialEmail =
    emailFromQuery || (ctx?.authenticated && ctx.email ? ctx.email.trim() : "");
  const sessionResolved = ctx !== null;

  return (
    <Suspense fallback={<HairGetStartedNeutralLoading />}>
      <GetStartedPageClient
        initialMode={initialMode}
        initialEmail={initialEmail}
        sessionResolved={sessionResolved}
      />
    </Suspense>
  );
}
