import type { Metadata } from "next";
import HairMutedDashboardRouteClient from "@/components/hair-dashboard-muted/HairMutedDashboardRouteClient";

export const metadata: Metadata = {
  title: "Your report is being prepared | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

export default function DashboardMutedPage() {
  return <HairMutedDashboardRouteClient />;
}
