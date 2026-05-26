"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { withClientNetworkContext } from "@/lib/client-network-context";
import { getMetaClickIds } from "@/lib/meta-tracking";
import { getTikTokClickIds } from "@/lib/tiktok-tracking";
import { getRedditClickIds } from "@/lib/reddit-tracking";
import {
  buildMetaEventUserData,
  splitFullNameToMetaFields,
} from "@/lib/meta-event-user-data";
import { pushToDataLayer } from "@/lib/gtm-tracking";
import styles from "./hair-muted.module.scss";

const EXPRESS_DELIVERY_PRICE = 50;

type ExpressDrawerProps = {
  onClose: () => void;
  customerId: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerName: string | null;
  customerCity: string | null;
  customerRegion: string | null;
  customerPostcode: string | null;
  onPurchaseComplete: () => void;
};

const STAGES = [
  { name: "Hair & Scalp Analysis", days: "5 DAYS" },
  { name: "Clinical Hair Assessment", days: "6 DAYS" },
  { name: "Report Preparation", days: "4 DAYS" },
  { name: "Specialist Review", days: "5 DAYS" },
  { name: "Report Finalization", days: "5 DAYS" },
];

type Modal = "surgeon-matches" | "express-delivery" | null;

function SurgeonMatchesModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal aria-labelledby="surgeonModalTitle">
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.modalLeft}>
          <h1 className={styles.modalLeftTitle}>
            Your report is being <em>prepared</em>
          </h1>
          <p className={styles.modalLeftSub}>
            We&apos;ll email you when it&apos;s ready. You may close this tab safely.
          </p>

          <div className={styles.stageEcho} aria-hidden="true">
            {STAGES.map((s) => (
              <div key={s.name} className={styles.stageEchoRow}>
                <span className={styles.stageEchoName}>{s.name}</span>
                <span className={styles.stageEchoDays}>{s.days}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.modalRight}>
          <span className={styles.modalEyebrow}>Surgeon Matches</span>
          <h2 id="surgeonModalTitle" className={styles.modalRightTitle}>
            Available after your report is <em>delivered</em>
          </h2>
          <p className={styles.modalBody}>
            We use your complete clinical hair assessment — pattern, stage, donor capacity,
            candidacy, and recommended path — to match you with surgeons whose technique and
            outcomes fit your specific case.
          </p>
          <p className={styles.modalBody}>
            Once your report is ready, you&apos;ll be able to request your matches directly from
            your concierge.
          </p>

          <div className={styles.membershipBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Included with your membership
          </div>

          <div className={styles.modalSpacer} />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalGotItBtn} onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpressDeliveryDrawer({
  onClose,
  customerId,
  customerEmail,
  customerPhone,
  customerName,
  customerCity,
  customerRegion,
  customerPostcode,
  onPurchaseComplete,
}: ExpressDrawerProps) {
  const [status, setStatus] = useState<"idle" | "processing">("idle");
  const [closing, setClosing] = useState(false);

  const idempotencyKeyRef = useRef<string | null>(null);
  if (idempotencyKeyRef.current === null) {
    const suffix =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    idempotencyKeyRef.current = `express-delivery-hair-${customerId}-${suffix}`;
  }

  const handleClose = useCallback(() => {
    setClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (closing) onClose();
  }, [closing, onClose]);

  const handleConfirm = async () => {
    if (status === "processing") return;
    setStatus("processing");

    try {
      const res = await fetch("/api/payments/charge-on-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          amount_cents: EXPRESS_DELIVERY_PRICE * 100,
          reason: "Express delivery upgrade",
          idempotency_key: idempotencyKeyRef.current,
          monday_mark_expedited_purchased: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Unable to process payment. Please try again.");
      }

      void (async () => {
        const { fbc, fbp } = getMetaClickIds();
        const { ttclid, ttp } = getTikTokClickIds();
        const { rdt_cid, rdt_uuid } = getRedditClickIds();
        const { fn, ln } = splitFullNameToMetaFields(customerName);
        const user_data = await buildMetaEventUserData(
          withClientNetworkContext({
            em: customerEmail,
            ph: customerPhone,
            fn,
            ln,
            ct: customerCity,
            st: customerRegion,
            zp: customerPostcode,
            external_id: customerId,
            fbc,
            fbp,
            ttclid,
            ttp,
            rdt_cid,
            rdt_uuid,
          }),
        );
        pushToDataLayer({
          event: "hair_purchase_expedited",
          customer_id: customerId,
          ...(Object.keys(user_data).length > 0 ? { user_data } : {}),
        });
      })().catch((error) => {
        console.error("[GTM] Failed to push purchase_expedited user_data:", error);
        pushToDataLayer({
          event: "hair_purchase_expedited",
          customer_id: customerId,
        });
      });

      onPurchaseComplete();
      handleClose();
    } catch (err) {
      console.error("[HairMutedDashboard] express upgrade failed:", err);
      setStatus("idle");
    }
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${closing ? styles.backdropClosing : ""}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${closing ? styles.drawerClosing : ""}`}
        role="dialog"
        aria-modal
        aria-labelledby="expressDrawerTitle"
        onAnimationEnd={handleAnimationEnd}
      >
        <button className={styles.drawerClose} onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.drawerBody}>
          <span className={styles.drawerEyebrow}>Add-On</span>
          <h1 id="expressDrawerTitle" className={styles.drawerTitle}>Express Delivery</h1>
          <p className={styles.drawerDesc}>
            Get your personalized hair report in 2–4 business days instead of the standard 25.
          </p>

          <div className={styles.drawerSummary}>
            <div className={styles.drawerSummaryRow}>
              <span className={styles.drawerSummaryLabel}>Express Delivery</span>
              <span className={styles.drawerSummaryPrice}>$50</span>
            </div>
            <div className={`${styles.drawerSummaryRow} ${styles.drawerSummaryTotal}`}>
              <span className={styles.drawerSummaryLabel}>Due today</span>
              <span className={styles.drawerSummaryPrice}>$50</span>
            </div>
          </div>

          <p className={styles.drawerCardNote}>Charged to your card on file.</p>
        </div>

        <div className={styles.drawerFooter}>
          <button
            className={styles.drawerConfirmBtn}
            onClick={handleConfirm}
            disabled={status === "processing"}
          >
            {status === "processing" ? "Processing…" : "Confirm & Pay — $50"}
          </button>
        </div>
      </aside>
    </>
  );
}

type HairMutedDashboardProps = {
  customerId: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerName: string | null;
  customerCity: string | null;
  customerRegion: string | null;
  customerPostcode: string | null;
  expeditedDeliveryPurchased: boolean;
  /** Affiliate client shell refetches context; main hair uses server `router.refresh()`. */
  onExpeditePurchaseComplete?: () => void | Promise<void>;
};

export default function HairMutedDashboard({
  customerId,
  customerEmail,
  customerPhone,
  customerName,
  customerCity,
  customerRegion,
  customerPostcode,
  expeditedDeliveryPurchased,
  onExpeditePurchaseComplete,
}: HairMutedDashboardProps) {
  const router = useRouter();
  const [modal, setModal] = useState<Modal>(null);
  const [expeditedPurchased, setExpeditedPurchased] = useState(expeditedDeliveryPurchased);

  useEffect(() => {
    setExpeditedPurchased(expeditedDeliveryPurchased);
  }, [expeditedDeliveryPurchased]);

  const closeModal = useCallback(() => setModal(null), []);
  const handleExpeditePurchaseComplete = useCallback(async () => {
    setExpeditedPurchased(true);
    try {
      if (onExpeditePurchaseComplete) {
        await onExpeditePurchaseComplete();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("[HairMutedDashboard] expedite context refresh failed:", err);
    }
  }, [onExpeditePurchaseComplete, router]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeModal]);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <a href="/" className={styles.brand}>
          AestheticMatch <em>Hair</em>
        </a>

        <Link href="/dashboard-muted/settings" className={styles.settingsBtn} aria-label="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Your report is being <em>prepared</em>
          </h1>
          <p className={styles.heroSub}>We&apos;ll email you when it&apos;s ready. You may close this tab safely.</p>
        </div>

        <div className={styles.stagesCard}>
          {STAGES.map((s) => (
            <div key={s.name} className={styles.stageRow}>
              <span className={styles.stageName}>{s.name}</span>
              <span className={styles.stageDays}>{s.days}</span>
            </div>
          ))}
          <div className={styles.stagesFooter}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {expeditedPurchased ? "EXPRESS: 2–4 BUSINESS DAYS" : "25 BUSINESS DAYS LEFT"}
          </div>
        </div>

        <div className={styles.expandCard}>
          <h2 className={styles.expandTitle}>
            Expand your <em>report</em>
          </h2>
          <p className={styles.expandDesc}>
            Unlock vetted, ranked surgeon matches for your specific case — surgeons selected on
            technique, outcome data, and specialty fit.
          </p>
          <button
            className={styles.upsellPill}
            onClick={() => setModal("surgeon-matches")}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Surgeon Matches
          </button>
        </div>

        {expeditedPurchased ? (
          <div className={styles.expressCard}>
            <div className={styles.expressDone} role="status">
              <span className={styles.expressDoneCheck} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div>
                <p className={styles.expressDoneTitle}>Express delivery</p>
                <p className={styles.expressDoneSub}>
                  Your report is prioritized for 2–4 business days.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.expressCard}>
            <h2 className={styles.expressTitle}>
              Need it <em>sooner?</em>
            </h2>
            <p className={styles.expressDesc}>
              Upgrade to express delivery and start your treatment in 2–4 business days.
            </p>
            <button
              className={styles.expressBtn}
              onClick={() => setModal("express-delivery")}
              type="button"
            >
              Upgrade to express
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {modal === "surgeon-matches" && <SurgeonMatchesModal onClose={closeModal} />}
      {modal === "express-delivery" && !expeditedPurchased && (
        <ExpressDeliveryDrawer
          onClose={closeModal}
          customerId={customerId}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          customerName={customerName}
          customerCity={customerCity}
          customerRegion={customerRegion}
          customerPostcode={customerPostcode}
          onPurchaseComplete={handleExpeditePurchaseComplete}
        />
      )}
    </div>
  );
}
