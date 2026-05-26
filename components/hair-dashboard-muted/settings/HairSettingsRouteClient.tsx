"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchDashboardSettingsContext, HairApiError } from "@/lib/api-client";
import HairSettingsPageClient, {
  type HairSettingsPageClientProps,
} from "./HairSettingsPageClient";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; props: HairSettingsPageClientProps };

function HairSettingsRouteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<State>({ status: "loading" });
  const queryString = searchParams.toString();

  useEffect(() => {
    let cancelled = false;
    fetchDashboardSettingsContext(queryString ? `?${queryString}` : undefined)
      .then((data) => {
        if (cancelled) return;
        setState({
          status: "ready",
          props: {
            tabParam: data.tabParam,
            initials: data.initials,
            displayName: data.displayName,
            memberLine: data.memberLine,
            initialFullName: data.initialFullName,
            initialPhone: data.initialPhone,
            initialEmail: data.initialEmail,
            initialLocation: data.initialLocation,
            billingSubscriptionStatus: data.billingSubscriptionStatus,
            billingCurrentPeriodEnd: data.billingCurrentPeriodEnd,
            billingMondayRenewalYmd: data.billingMondayRenewalYmd,
            billingCancelAtPeriodEnd: data.billingCancelAtPeriodEnd,
            billingCanOpenStripePortal: data.billingCanOpenStripePortal,
            billingPaymentStatus: data.billingPaymentStatus,
            billingPaymentHistory: data.billingPaymentHistory,
            billingCardLast4: data.billingCardLast4,
          },
        });
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof HairApiError && (err.status === 401 || err.status === 403)) {
          router.replace("/get-started?mode=signin");
          return;
        }
        setState({
          status: "error",
          message: "Could not load settings. Try signing in again.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [router, queryString]);

  if (state.status === "loading") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FCFAF7",
          color: "#6b6b6b",
        }}
        aria-busy="true"
      >
        Loading…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <main style={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
        <h1>Settings</h1>
        <p>{state.message}</p>
        <p>
          <a href="/get-started?mode=signin">Sign in</a>
        </p>
      </main>
    );
  }

  return <HairSettingsPageClient {...state.props} />;
}

export default function HairSettingsRouteClient() {
  return (
    <Suspense fallback={null}>
      <HairSettingsRouteInner />
    </Suspense>
  );
}
