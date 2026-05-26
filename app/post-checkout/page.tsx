import type { Metadata } from "next";
import { Suspense } from "react";
import PostCheckoutPageClient from "@/components/post-checkout/PostCheckoutPageClient";

export const metadata: Metadata = {
  title: "Payment confirmed | AestheticMatch Hair",
  robots: "noindex, nofollow",
};

export default function PostCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <PostCheckoutPageClient />
    </Suspense>
  );
}
