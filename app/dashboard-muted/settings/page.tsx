import type { Metadata } from "next";
import HairSettingsRouteClient from "@/components/hair-dashboard-muted/settings/HairSettingsRouteClient";

export const metadata: Metadata = {
  title: "Settings | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

export default function DashboardMutedSettingsPage() {
  return <HairSettingsRouteClient />;
}
