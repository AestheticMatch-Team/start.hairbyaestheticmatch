"use client";

import { useEffect, useState } from "react";
import { fetchGetStartedContext } from "@/lib/api-client";
import GetStartedClient from "./GetStartedClient";
import { HairGetStartedFullLoading } from "./HairGetStartedLoadingShell";

type Props = {
  initialMode: "signin" | "signup";
  initialEmail: string;
  /** Server already resolved session; skip client loading gate. */
  sessionResolved?: boolean;
};

export default function GetStartedPageClient({
  initialMode,
  initialEmail,
  sessionResolved = false,
}: Props) {
  const [ready, setReady] = useState(sessionResolved);
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    if (sessionResolved) return;

    const mode = initialMode === "signin" ? "signin" : "signup";
    let cancelled = false;

    void fetchGetStartedContext(`?mode=${mode}`)
      .then((ctx) => {
        if (cancelled) return;
        if (ctx.authenticated && ctx.redirect) {
          window.location.assign(
            ctx.redirect.startsWith("/") ? ctx.redirect : `/${ctx.redirect}`,
          );
          return;
        }
        if (ctx.authenticated && ctx.email) {
          setEmail(ctx.email.trim());
        }
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [initialMode, sessionResolved]);

  if (!ready) {
    return <HairGetStartedFullLoading />;
  }

  return (
    <GetStartedClient variant="hair" initialMode={initialMode} initialEmail={email} />
  );
}
