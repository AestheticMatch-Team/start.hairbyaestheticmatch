"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPostCheckoutContext, HairApiError } from "@/lib/api-client";
import { funnelStepHref } from "@/lib/funnel";
import PostCheckoutClient from "./PostCheckoutClient";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      customerId: string;
      scheduleToken: string;
      browserPurchase?: { transaction_id: string };
      purchaseContact?: { email?: string; phone?: string; name?: string };
    };

export default function PostCheckoutPageClient() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchPostCheckoutContext()
      .then((data) => {
        if (cancelled) return;
        if (data.redirect) {
          window.location.href = funnelStepHref(data.redirect);
          return;
        }
        if (!data.customerId) {
          setState({ status: "error", message: "Could not load your account. Please sign in." });
          return;
        }
        setState({
          status: "ready",
          customerId: data.customerId,
          scheduleToken: data.scheduleToken ?? "",
          browserPurchase: data.browserPurchase,
          purchaseContact: data.purchaseContact,
        });
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
          message: "Could not verify payment. Try signing in or contact support.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (state.status === "loading") {
    return (
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fdfcf9",
        }}
        aria-busy="true"
      >
        <p style={{ color: "#5c6370" }}>Confirming your payment…</p>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main style={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
        <h1>Post-checkout</h1>
        <p>{state.message}</p>
        <p>
          <a href="/get-started?mode=signin">Sign in</a>
        </p>
      </main>
    );
  }

  return (
    <PostCheckoutClient
      customerId={state.customerId}
      scheduleToken={state.scheduleToken}
      hairUi
      browserPurchase={state.browserPurchase}
      purchaseContact={state.purchaseContact}
    />
  );
}
