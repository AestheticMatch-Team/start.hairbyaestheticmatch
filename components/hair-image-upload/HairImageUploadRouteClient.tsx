"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { fetchImageUploadContext, HairApiError } from "@/lib/api-client";
import HairImageUploadPageClient from "./HairImageUploadPageClient";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      mondayItemId?: string;
      uploadToken?: string;
      initialUploadedAngles?: Record<string, boolean>;
    };

function HairImageUploadRouteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<State>({ status: "loading" });

  const paramItemId = searchParams.get("itemId") ?? searchParams.get("monday_item_id");
  const urlToken = searchParams.get("token") ?? undefined;
  const queryString = searchParams.toString();

  useEffect(() => {
    let cancelled = false;
    fetchImageUploadContext(queryString ? `?${queryString}` : undefined)
      .then((data) => {
        if (cancelled) return;
        const mondayItemId =
          (paramItemId?.trim() ? paramItemId.trim() : null) ??
          (data.mondayItemId?.trim() ? data.mondayItemId.trim() : undefined);
        setState({
          status: "ready",
          mondayItemId,
          uploadToken: urlToken ?? data.uploadToken,
          initialUploadedAngles: data.initialUploadedAngles,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof HairApiError && err.status === 401) {
          router.replace("/get-started?mode=signin");
          return;
        }
        setState({
          status: "error",
          message: "Could not load photo upload. Sign in or use your email link.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [router, queryString, paramItemId, urlToken]);

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
        <h1>Photo upload</h1>
        <p>{state.message}</p>
        <p>
          <a href="/get-started?mode=signin">Sign in</a>
        </p>
      </main>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <HairImageUploadPageClient
        mondayItemId={state.mondayItemId}
        uploadToken={state.uploadToken}
        initialUploadedAngles={state.initialUploadedAngles}
      />
    </>
  );
}

export default function HairImageUploadRouteClient() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FCFAF7",
            color: "#6b6b6b",
          }}
        >
          Loading…
        </div>
      }
    >
      <HairImageUploadRouteInner />
    </Suspense>
  );
}
