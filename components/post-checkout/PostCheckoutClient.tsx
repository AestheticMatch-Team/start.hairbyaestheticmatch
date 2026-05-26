"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./post-checkout.module.scss";
import { funnelStepHref } from "@/lib/funnel";
import { trackPurchase, ensureDataLayer } from "@/lib/gtm-tracking";
import { withClientNetworkContext } from "@/lib/client-network-context";
import { getMetaClickIds } from "@/lib/meta-tracking";
import { getTikTokClickIds } from "@/lib/tiktok-tracking";
import { getRedditClickIds } from "@/lib/reddit-tracking";
import { splitFullNameToMetaFields } from "@/lib/meta-event-user-data";

const POST_CHECKOUT_IDLE_MS = 30 * 60 * 1000;
const UNMOUNT_SCHEDULE_MIN_MS = 200;

function scheduleSeriesERequest(customerId: string, scheduleToken: string, useBeacon: boolean) {
  if (!scheduleToken) return;
  const payload = JSON.stringify({ customer_id: customerId, token: scheduleToken });
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/post-checkout/schedule-quiz-not-started-emails`
      : "/api/post-checkout/schedule-quiz-not-started-emails";
  if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

async function cancelSeriesEFromSession() {
  try {
    await fetch("/api/post-checkout/cancel-quiz-not-started-emails", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    /* non-fatal */
  }
}

type Props = {
  customerId: string;
  scheduleToken: string;
  hairUi?: boolean;
  /** `value' is optional; GTM purchase always uses fixed USD tracking value */
  browserPurchase?: { transaction_id: string; value?: number };
  purchaseContact?: { email?: string; phone?: string; name?: string };
};

export default function PostCheckoutClient({
  customerId,
  scheduleToken,
  hairUi = false,
  browserPurchase,
  purchaseContact,
}: Props) {
  const skipScheduleRef = useRef(false);

  useEffect(() => {
    if (!browserPurchase?.transaction_id) {
      return;
    }
    ensureDataLayer();
    const { fbc, fbp } = getMetaClickIds();
    const { ttclid, ttp } = getTikTokClickIds();
    const { rdt_cid, rdt_uuid } = getRedditClickIds();
    const { fn, ln } = splitFullNameToMetaFields(purchaseContact?.name);
    trackPurchase({
      transaction_id: browserPurchase.transaction_id,
      currency: "USD",
      eventName: hairUi ? "hair_purchase" : "purchase",
      user_data: withClientNetworkContext({
        em: purchaseContact?.email,
        ph: purchaseContact?.phone,
        fn,
        ln,
        external_id: customerId,
        fbc,
        fbp,
        ttclid,
        ttp,
        rdt_cid,
        rdt_uuid,
      }),
    });
  }, [browserPurchase?.transaction_id, customerId, purchaseContact?.email, purchaseContact?.phone, purchaseContact?.name, hairUi]);

  useEffect(() => {
    if (!scheduleToken) return;

    const effectStartedAt = Date.now();
    let idleTimer: ReturnType<typeof setTimeout>;

    const bumpIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (skipScheduleRef.current) return;
        scheduleSeriesERequest(customerId, scheduleToken, false);
      }, POST_CHECKOUT_IDLE_MS);
    };

    bumpIdle();
    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("mousemove", bumpIdle, opts);
    window.addEventListener("keydown", bumpIdle, opts);
    window.addEventListener("scroll", bumpIdle, opts);
    window.addEventListener("touchstart", bumpIdle, opts);

    const onPageHide = () => {
      if (skipScheduleRef.current) return;
      scheduleSeriesERequest(customerId, scheduleToken, true);
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", bumpIdle);
      window.removeEventListener("keydown", bumpIdle);
      window.removeEventListener("scroll", bumpIdle);
      window.removeEventListener("touchstart", bumpIdle);
      window.removeEventListener("pagehide", onPageHide);

      if (Date.now() - effectStartedAt >= UNMOUNT_SCHEDULE_MIN_MS && !skipScheduleRef.current) {
        scheduleSeriesERequest(customerId, scheduleToken, true);
      }
    };
  }, [customerId, scheduleToken]);

  return (
    <div className={styles.page}>
      <div className={styles.page__before} aria-hidden />

      <div className={styles.center}>
        <div className={styles.card}>
          <p className={clsx(styles.label, hairUi && styles.labelHair)}>You&apos;re In</p>
          <h1 className={styles.heading}>Let&apos;s build your assessment.</h1>
          <p className={styles.body}>
            Payment confirmed. Your account has been created. Complete your questionnaire and upload
            your photos — we&apos;ll take it from here.
          </p>
          <Link
            href={hairUi ? funnelStepHref("/post-quiz") : "/find-your-match"}
            className={clsx(styles.cta, hairUi && styles.ctaHair)}
            onClick={() => {
              skipScheduleRef.current = true;
              void cancelSeriesEFromSession();
            }}
          >
            Start Your Questionnaire
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
