"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPostQuizContext, HairApiError } from "@/lib/api-client";
import type { HairPostQuizAnswers } from "@/lib/hair-post-quiz-answers";
import { HairPostQuizFlow } from "./HairPostQuizFlow";

function parseFirstName(fullName: string): string {
  return fullName?.trim().split(/\s+/)[0] ?? "";
}

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      customerId: string;
      email: string;
      name: string;
      phone: string;
      savedAnswers: Record<string, unknown>;
      hairPq: Record<string, unknown>;
      initialStep: number;
    };

export default function HairPostQuizPageClient() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchPostQuizContext()
      .then((data) => {
        if (cancelled) return;
        if (!data.customerId) {
          setState({ status: "error", message: "Could not load your account." });
          return;
        }
        setState({
          status: "ready",
          customerId: data.customerId,
          email: data.email ?? "",
          name: data.name ?? "",
          phone: data.phone ?? "",
          savedAnswers: data.savedAnswers ?? {},
          hairPq: data.hairPq ?? {},
          initialStep: data.initialStep ?? 0,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof HairApiError) {
          if (err.status === 401) {
            router.replace("/get-started?mode=signin");
            return;
          }
          if (err.status === 403) {
            router.replace("/get-started?mode=signup");
            return;
          }
        }
        setState({
          status: "error",
          message: "Could not load your assessment. Try signing in again.",
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
          background: "#FCFAF7",
          color: "#6b6b6b",
          fontSize: 15,
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
        <h1>Your assessment</h1>
        <p>{state.message}</p>
        <p>
          <a href="/get-started?mode=signin">Sign in</a>
        </p>
      </main>
    );
  }

  return (
    <HairPostQuizFlow
      customerId={state.customerId}
      email={state.email}
      firstName={parseFirstName(state.name)}
      fullName={state.name}
      phone={state.phone}
      savedAnswers={(state.savedAnswers ?? {}) as Partial<HairPostQuizAnswers>}
      hairPq={state.hairPq}
      initialStep={state.initialStep}
    />
  );
}
