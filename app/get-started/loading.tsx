import { Suspense } from "react";
import HairGetStartedRouteLoading from "@/components/get-started/HairGetStartedRouteLoading";
import { HairGetStartedNeutralLoading } from "@/components/get-started/HairGetStartedLoadingShell";

export default function HairGetStartedLoading() {
  return (
    <Suspense fallback={<HairGetStartedNeutralLoading />}>
      <HairGetStartedRouteLoading />
    </Suspense>
  );
}
