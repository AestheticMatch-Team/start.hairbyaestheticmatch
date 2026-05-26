"use client";

import { useEffect } from "react";
import { captureUTMParams } from "@/lib/utm-tracking";
import { captureMetaClickIds } from "@/lib/meta-tracking";
import { captureTikTokClickIds } from "@/lib/tiktok-tracking";
import { captureRedditClickIds } from "@/lib/reddit-tracking";

export default function UTMTracker() {
  useEffect(() => {
    captureUTMParams();
    captureMetaClickIds();
    captureTikTokClickIds();
    captureRedditClickIds();
  }, []);

  return null;
}
