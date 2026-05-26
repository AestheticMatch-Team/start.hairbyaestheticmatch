import type { Metadata } from "next";
import HairImageUploadRouteClient from "@/components/hair-image-upload/HairImageUploadRouteClient";

export const metadata: Metadata = {
  title: "Photo Upload | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

export default function ImageUploadPage() {
  return <HairImageUploadRouteClient />;
}
