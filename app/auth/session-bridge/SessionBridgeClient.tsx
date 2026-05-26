"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-auth/client";

function isSafeNextPath(value: string | null): value is string {
  if (!value) return false;
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  return true;
}

/**
 * Sets Supabase session from hash tokens after paywall-signup generateLink,
 * then hard-navigates to `next`. Must run on the affiliate host (not proxied).
 */
export default function SessionBridgeClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function bridge() {
      const rawNext = searchParams.get("next");
      const next = isSafeNextPath(rawNext) ? rawNext : "/";

      const hash = window.location.hash.slice(1);
      if (!hash) {
        window.location.replace("/get-started?mode=signin");
        return;
      }

      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        window.location.replace("/get-started?mode=signin");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.error("[session-bridge] setSession error:", error.message);
        window.location.replace("/get-started?mode=signin");
        return;
      }

      window.location.replace(next);
    }

    void bridge();
  }, [searchParams]);

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: "#faf8f5",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "9999px",
          border: "3px solid #e2e8f0",
          borderTopColor: "#0f172a",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
