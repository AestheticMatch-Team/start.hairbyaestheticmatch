"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paywallFigma } from "./paywallFigmaAssets";
import styles from "./paywall.module.scss";
import { pushToDataLayer } from "@/lib/gtm-tracking";
import { trackOpsEvent } from "@/lib/track-ops-event";
import { getMetaClickIds } from "@/lib/meta-tracking";
import { getTikTokClickIds } from "@/lib/tiktok-tracking";
import { getRedditClickIds } from "@/lib/reddit-tracking";
import { withClientNetworkContext } from "@/lib/client-network-context";
import {
  buildMetaEventUserData,
  splitFullNameToMetaFields,
} from "@/lib/meta-event-user-data";

function VerifyIcon({
  className,
  fill = "#0A473B",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.3736 7.16012L13.4669 6.10679C13.2936 5.90679 13.1536 5.53345 13.1536 5.26679V4.13345C13.1536 3.42679 12.5736 2.84679 11.8669 2.84679H10.7336C10.4736 2.84679 10.0936 2.70679 9.89358 2.53345L8.84025 1.62679C8.38025 1.23345 7.62691 1.23345 7.16025 1.62679L6.11358 2.54012C5.91358 2.70679 5.53358 2.84679 5.27358 2.84679H4.12025C3.41358 2.84679 2.83358 3.42679 2.83358 4.13345V5.27345C2.83358 5.53345 2.69358 5.90679 2.52691 6.10679L1.62691 7.16679C1.24025 7.62679 1.24025 8.37345 1.62691 8.83345L2.52691 9.89345C2.69358 10.0935 2.83358 10.4668 2.83358 10.7268V11.8668C2.83358 12.5735 3.41358 13.1535 4.12025 13.1535H5.27358C5.53358 13.1535 5.91358 13.2935 6.11358 13.4668L7.16691 14.3735C7.62691 14.7668 8.38025 14.7668 8.84691 14.3735L9.90025 13.4668C10.1002 13.2935 10.4736 13.1535 10.7402 13.1535H11.8736C12.5802 13.1535 13.1602 12.5735 13.1602 11.8668V10.7335C13.1602 10.4735 13.3002 10.0935 13.4736 9.89345L14.3802 8.84012C14.7669 8.38012 14.7669 7.62012 14.3736 7.16012ZM10.7736 6.74012L7.55358 9.96012C7.46025 10.0535 7.33358 10.1068 7.20025 10.1068C7.06691 10.1068 6.94025 10.0535 6.84691 9.96012L5.23358 8.34679C5.04025 8.15345 5.04025 7.83345 5.23358 7.64012C5.42691 7.44679 5.74691 7.44679 5.94025 7.64012L7.20025 8.90012L10.0669 6.03345C10.2602 5.84012 10.5802 5.84012 10.7736 6.03345C10.9669 6.22679 10.9669 6.54679 10.7736 6.74012Z"
        fill={fill}
      />
    </svg>
  );
}

export default function PaymentForm({
  customerId,
  email,
  name,
  phone,
  price = 149,
  variant = "desktop",
  className,
  titleClassName,
  ctaSentinelRef,
  isHairPaywall = false,
}: {
  customerId: string;
  email: string;
  name?: string;
  phone?: string;
  price?: 149 | 129 | 79;
  variant?: "desktop" | "mobile";
  className?: string;
  titleClassName?: string;
  ctaSentinelRef?: React.Ref<HTMLDivElement>;
  isHairPaywall?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const addPaymentInfoFiredRef = useRef(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const fireAddPaymentInfoEvent = async () => {
    const { fbc, fbp } = getMetaClickIds();
    const { ttclid, ttp } = getTikTokClickIds();
    const { rdt_cid, rdt_uuid } = getRedditClickIds();
    const { fn, ln } = splitFullNameToMetaFields(name);
    const user_data = await buildMetaEventUserData(
      withClientNetworkContext({
        em: email,
        ph: phone,
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
    );
    pushToDataLayer({
      event: isHairPaywall ? "hair_add_payment_info" : "add_payment_info",
      ...(Object.keys(user_data).length > 0 ? { user_data } : {}),
    });
    void trackOpsEvent(
      {
        eventType: "add_payment_info",
        customerId,
        email,
        metadata: { source: "paywall_payment_element" },
      },
      { keepalive: true },
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 520px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const paymentElementOptions = useMemo(() => {
    const useTabs = variant === "mobile";
    return {
      layout: useTabs
        ? ("tabs" as const)
        : isMobile
          ? {
              type: "accordion" as const,
              radios: "if_multiple" as const,
              spacedAccordionItems: true,
              visibleAccordionItemsCount: 0,
            }
          : ("tabs" as const),
      paymentMethodOrder: [
        "apple_pay",
        "google_pay",
        "card",
        "klarna",
        "afterpay_clearpay",
      ],
      wallets: {
        link: "never" as const,
        applePay: "auto" as const,
        googlePay: "auto" as const,
      },
    };
  }, [isMobile, variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    const origin = window.location.origin;
    /** Decoupled start.* / localhost:3000 affiliate — stay on paying host after Stripe */
    const nextParam = isHairPaywall ? "affiliate_post_checkout" : "";
    const returnUrl = `${origin}/api/checkout/pi-success?customer_id=${encodeURIComponent(customerId)}&email=${encodeURIComponent(email)}${nextParam ? `&next=${encodeURIComponent(nextParam)}&return_origin=${encodeURIComponent(origin)}` : ""}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (error) {
      setErrorMsg(error.message || "Payment failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[styles.paymentShell, className].filter(Boolean).join(" ")}
    >
      {variant === "desktop" ? (
        <div className={styles.paymentExpressTitleBlock}>
          <h2
            className={[styles.paymentExpressHeadline, titleClassName]
              .filter(Boolean)
              .join(" ")}
          >
            Express Checkout
          </h2>
          <p className={styles.paymentExpressSubline}>
            Secure payment · 7-day money-back guarantee
          </p>
        </div>
      ) : (
        <>
          <h2
            className={[styles.paymentTitle, titleClassName]
              .filter(Boolean)
              .join(" ")}
          >
            Pay With
          </h2>
          <hr className={styles.paymentRule} />
        </>
      )}

      <div className={styles.paymentStack}>
        {variant === "desktop" ? (
          <div className={styles.stripeSlot}>
            <PaymentElement
              options={paymentElementOptions}
              onChange={(e) => {
                if (e.complete && !addPaymentInfoFiredRef.current) {
                  addPaymentInfoFiredRef.current = true;
                  void fireAddPaymentInfoEvent().catch((error) => {
                    console.error(
                      "[GTM] Failed to push add_payment_info user_data:",
                      error,
                    );
                    pushToDataLayer({
                      event: isHairPaywall ? "hair_add_payment_info" : "add_payment_info",
                    });
                  });
                }
              }}
            />
          </div>
        ) : (
          <div className={styles.stripeSlot}>
            <PaymentElement
              options={paymentElementOptions}
              onChange={(e) => {
                if (e.complete && !addPaymentInfoFiredRef.current) {
                  addPaymentInfoFiredRef.current = true;
                  void fireAddPaymentInfoEvent().catch((error) => {
                    console.error(
                      "[GTM] Failed to push add_payment_info user_data:",
                      error,
                    );
                    pushToDataLayer({
                      event: isHairPaywall ? "hair_add_payment_info" : "add_payment_info",
                    });
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      {errorMsg && <p className={styles.paymentError}>{errorMsg}</p>}

      <div className={styles.ctaBlock} ref={ctaSentinelRef}>
        <button
          type="submit"
          className={`${styles.payBtn} ${isHairPaywall ? styles.hairPayBtn : ""}`}
          disabled={!stripe || !elements || status === "loading"}
        >
          {status === "loading" ? (
            "Processing…"
          ) : variant === "mobile" ? (
            <span className={styles.payBtnLabel}>
              <span className={styles.payBtnLabelMain}>
                Get My Assessment ·{" "}
              </span>
              <span className={styles.payBtnLabelPrice}>${price}</span>
            </span>
          ) : (
            `Get My Assessment · $${price}`
          )}
        </button>
        <div className={styles.ctaSubStack}>
          <div className={styles.ctaSubRow}>
            <p className={styles.ctaGuarantee}>7-day money-back guarantee</p>
            <a
              href="/terms"
              className={`${styles.ctaTerms} ${isHairPaywall ? styles.hairCtaTerms : ""}`}
            >
              Terms
            </a>
          </div>
          <div className={styles.ctaVerifyRow}>
            <VerifyIcon
              className={styles.ctaVerifyIcon}
              fill={isHairPaywall ? "#5a7a96" : undefined}
            />
            <p className={styles.ctaVerifyText}>
              Less than 0.5% of buyers use our money-back guarantee
            </p>
          </div>
        </div>
      </div>

      {variant === "desktop" ? (
        <div className={styles.expressTrustRow}>
          {[
            "HIPAA-aligned",
            "Board-certified",
            "2,400+ matched",
            "Encrypted",
          ].map((label) => (
            <div key={label} className={styles.expressTrustChip}>
              <span className={styles.expressTrustDot} aria-hidden />
              <span>{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.trustPills}>
          <div className={styles.trustPillsRow}>
            <div className={styles.trustPill}>
              <span className={styles.trustPillIcon}>
                <Image
                  src={paywallFigma.trustLock}
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
              </span>
              Photos encrypted &amp; never shared
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
