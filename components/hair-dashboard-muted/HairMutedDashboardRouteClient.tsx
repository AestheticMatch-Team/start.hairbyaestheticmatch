"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchDashboardMutedContext,
  HairApiError,
  type DashboardMutedContextResponse,
} from "@/lib/api-client";
import HairMutedDashboard from "./HairMutedDashboard";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      customerId: string;
      customerEmail: string | null;
      customerPhone: string | null;
      customerName: string | null;
      customerCity: string | null;
      customerRegion: string | null;
      customerPostcode: string | null;
      expeditedDeliveryPurchased: boolean;
    };

function readyStateFromContext(data: DashboardMutedContextResponse): Extract<State, { status: "ready" }> {
  return {
    status: "ready",
    customerId: data.customerId,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    customerName: data.customerName,
    customerCity: data.customerCity,
    customerRegion: data.customerRegion,
    customerPostcode: data.customerPostcode,
    expeditedDeliveryPurchased: data.expeditedDeliveryPurchased,
  };
}

export default function HairMutedDashboardRouteClient() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  const reloadDashboardContext = useCallback(async () => {
    const data = await fetchDashboardMutedContext();
    setState(readyStateFromContext(data));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchDashboardMutedContext()
      .then((data) => {
        if (cancelled) return;
        setState(readyStateFromContext(data));
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof HairApiError) {
          if (err.status === 401 || err.status === 403) {
            router.replace("/get-started?mode=signin");
            return;
          }
        }
        setState({
          status: "error",
          message: "Could not load your dashboard. Try signing in again.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (state.status === "loading") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1a2e",
          color: "#c8d0dc",
        }}
        aria-busy="true"
      >
        Loading…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <main style={{ padding: "2rem", maxWidth: 480, margin: "0 auto", color: "#fff" }}>
        <h1>Dashboard</h1>
        <p>{state.message}</p>
        <p>
          <a href="/get-started?mode=signin">Sign in</a>
        </p>
      </main>
    );
  }

  return (
    <HairMutedDashboard
      customerId={state.customerId}
      customerEmail={state.customerEmail}
      customerPhone={state.customerPhone}
      customerName={state.customerName}
      customerCity={state.customerCity}
      customerRegion={state.customerRegion}
      customerPostcode={state.customerPostcode}
      expeditedDeliveryPurchased={state.expeditedDeliveryPurchased}
      onExpeditePurchaseComplete={reloadDashboardContext}
    />
  );
}
