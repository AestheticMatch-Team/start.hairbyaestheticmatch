import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import HairPaywallPageClient from "@/components/paywall/HairPaywallPageClient";
import { fetchBackendJson } from "@/lib/fetch-backend-context";
import { resolveHairPaywallPriceFromSearchParams } from "@/lib/resolve-hair-paywall-price";

export const metadata: Metadata = {
  title: "Checkout | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

type PaywallContextResponse = {
  customerId: string;
  email: string;
  priceVariant: 149 | 79;
};

export default async function PaywallPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const val = firstParam(v);
    if (val) sp.set(k, val);
  }

  const qs = sp.toString();
  const fromBackend = qs
    ? await fetchBackendJson<PaywallContextResponse>(`/api/hair/paywall-context?${qs}`)
    : null;

  const resolved = fromBackend
    ? {
        customerId: fromBackend.customerId,
        email: fromBackend.email,
        priceVariant: fromBackend.priceVariant,
      }
    : resolveHairPaywallPriceFromSearchParams(sp);

  if (!resolved) {
    redirect("/get-started");
  }

  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100dvh", background: "#fdfcf9" }} aria-busy="true" />
      }
    >
      <HairPaywallPageClient resolvedPriceVariant={resolved.priceVariant} />
    </Suspense>
  );
}
