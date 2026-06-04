"use client";

import { useEffect } from "react";
import { captureUTMParams } from "@/lib/utm-tracking";
import { captureMetaClickIds } from "@/lib/meta-tracking";
import { captureTikTokClickIds } from "@/lib/tiktok-tracking";
import { captureRedditClickIds } from "@/lib/reddit-tracking";
import { captureClickflareAttribution } from "@/lib/clickflare-attribution";

export default function UTMTracker() {
  useEffect(() => {
    captureUTMParams();
    captureMetaClickIds();
    captureTikTokClickIds();
    captureRedditClickIds();
    captureClickflareAttribution();
  }, []);

  return null;
}
