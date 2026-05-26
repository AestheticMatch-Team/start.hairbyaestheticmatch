import { Suspense } from "react";
import SessionBridgeClient from "./SessionBridgeClient";

export const metadata = {
  title: "Signing you in…",
  robots: { index: false },
};

export default function SessionBridgePage() {
  return (
    <Suspense fallback={null}>
      <SessionBridgeClient />
    </Suspense>
  );
}
