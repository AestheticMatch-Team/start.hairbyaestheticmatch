"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPreQuizContext } from "@/lib/api-client";
import type { HairPreQuizAnswers } from "@/lib/hair-pre-quiz-answers";
import type { HairPriceVariant } from "@/lib/resolve-hair-price-variant";
import { resolveHairPriceVariantFromSearchParams } from "@/lib/resolve-hair-price-variant";
import { HairPreQuizFlow } from "./HairPreQuizFlow";

function parseFirstName(fullName: string): string {
  return fullName?.trim().split(/\s+/)[0] ?? "";
}

export default function HairPreQuizPageClient() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customer_id") ?? "";
  const email = searchParams.get("email") ?? "";
  const name = searchParams.get("name") ?? "";
  const paywallParams = searchParams.toString();

  const fallbackVariant = resolveHairPriceVariantFromSearchParams(searchParams);
  const [savedAnswers, setSavedAnswers] = useState<Partial<HairPreQuizAnswers> | null>(null);
  const [resolvedPriceVariant, setResolvedPriceVariant] =
    useState<HairPriceVariant>(fallbackVariant);
  const [loading, setLoading] = useState(Boolean(customerId));

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }
    const extra = paywallParams
      ? paywallParams
          .split("&")
          .filter((p) => !p.startsWith("customer_id="))
          .join("&")
      : "";
    void fetchPreQuizContext(customerId, extra || undefined)
      .then((ctx) => {
        if (ctx.savedAnswers) {
          setSavedAnswers(ctx.savedAnswers as Partial<HairPreQuizAnswers>);
        }
        if (ctx.resolvedPriceVariant === 79 || ctx.resolvedPriceVariant === 149) {
          setResolvedPriceVariant(ctx.resolvedPriceVariant);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId, paywallParams]);

  if (!customerId) {
    return (
      <main style={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
        <h1>Pre-quiz</h1>
        <p>
          Missing <code>customer_id</code>. Complete{" "}
          <a href="/get-started">get started</a> first.
        </p>
      </main>
    );
  }

  if (loading) {
    return null;
  }

  return (
    <HairPreQuizFlow
      firstName={parseFirstName(name)}
      customerId={customerId}
      email={email || undefined}
      paywallParams={paywallParams || undefined}
      savedAnswers={savedAnswers ?? undefined}
      resolvedPriceVariant={resolvedPriceVariant}
    />
  );
}
