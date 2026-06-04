 "use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import PaymentForm from "@/components/paywall/PaymentForm";
import { pushToDataLayer } from "@/lib/gtm-tracking";
import { getMetaClickIds } from "@/lib/meta-tracking";
import { getTikTokClickIds } from "@/lib/tiktok-tracking";
import { getRedditClickIds } from "@/lib/reddit-tracking";
import { getClientNetworkContext, withClientNetworkContext } from "@/lib/client-network-context";
import { getAffiliateAttribution } from "@/lib/affiliate-attribution";
import { getClickflareAttribution } from "@/lib/clickflare-attribution";
import { getUTMParams } from "@/lib/utm-tracking";
import { buildMetaEventUserData, splitFullNameToMetaFields } from "@/lib/meta-event-user-data";
import styles from "./page.module.scss";

const includedItems = [
  ["Clinical diagnosis & candidacy", "Cause, pattern, stage — and where you stand on every viable treatment", "$89", "/paywall/icon-add-circle.svg"],
  ["1, 3, and 5-year progression forecast", "What happens if you do nothing — and how each path changes the curve", "$69", "/paywall/icon-clock.svg"],
  ["Outcome visualization across treatment paths", "Clinical projections calibrated to your case — not marketing renders", "$89", "/paywall/icon-profile.svg"],
  ["Specialist meeting (1:1 walkthrough)", "Walk through the report with your concierge specialist — questions, plain English", "$89", "/paywall/icon-layer.svg"],
  ["Prescription sourcing + protocol coordination", "Concierge handles Rx through licensed providers and sources compounded formulations", "$149", "/paywall/icon-tick-circle.svg"],
  ["Surgeon vetting & procedure coordination", "Matched against our 60+ network — vetted on technique, outcomes, and case fit", "$99", "/paywall/icon-layer.svg"],
  ["Plan-adjustment commitment", "If the first path doesn't get results, your concierge revises it — until something works", "$69", "/paywall/icon-clock.svg"],
] as const;

const testimonials = [
  [
    "Found The Right Surgeon",
    "\"Three consultations, three different graft counts. The report told me what I actually needed and the concierge matched me with a surgeon who specializes in crown work — not whoever happened to take my call.\"",
    "Marcus L.",
    "Norwood V vertex · Chicago, IL",
    "/hair/paywall/testimonials/marcus.jpg",
  ],
  [
    "Fixed The Wrong Protocol",
    "\"I'd been on minoxidil for two years and was still losing ground. The report identified what was actually driving my pattern and added PRP — the piece none of the specialists I'd seen had ever brought up.\"",
    "Arjun P.",
    "Norwood II–III · Austin, TX",
    "/hair/paywall/testimonials/arjun.jpg",
  ],
  [
    "Reversed The Loss",
    "\"My old protocol wasn't working. The report told me why. Switched to the right one and my crown's actually visibly denser than when I first started seriously worrying about it.\"",
    "Daniel R.",
    "Norwood III · Denver, CO",
    "/hair/paywall/testimonials/daniel.jpg",
  ],
] as const;

const faqs = [
  [
    "Will I be auto-charged for the membership?",
    "No. Your free month includes ongoing concierge access, our member FAQ with thousands of patients sharing their journeys, and our full educational library to help you save money on your treatment. After 30 days it's yours to keep at $99/mo or let lapse — your call.",
  ],
  [
    "What if I'm more confused after reading my report?",
    "That's exactly what your concierge is for. They'll walk you through every finding, answer every question, and clarify anything that doesn't land. If we still can't resolve it within 7 days of delivery, you get a full refund — no fight, no friction.",
  ],
  [
    "How is this different from a clinic consult or a telehealth subscription?",
    "Clinics sell what they do. Telehealth sells what they stock — usually the same three medications. We sell neither. We diagnose your case, identify what works for you, and our concierge executes the plan — whether that's meds, a procedure, or a combination. We're independent because that's the only way to get your case right.",
  ],
  [
    "Do you earn from surgeon referrals or pharmacy commissions?",
    "No. We take $0 in referral fees or commissions from any surgeon, clinic, or pharmacy. Our revenue comes from the assessment fee and optional continued support. Our only incentive is getting your case right.",
  ],
] as const;

const reportBullets = [
  "Clinical diagnosis with cause, pattern, and stage",
  "1, 3, and 5-year progression forecast",
  "Outcome visualization across treatment paths",
  "Candidacy across every treatment — meds, topicals, PRP, transplant",
  "Ranked recommendations — including \"do nothing yet\" if appropriate",
  "Step-by-step execution plan your concierge handles",
] as const;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const STRIPE_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#0a473b",
    colorBackground: "#ffffff",
    colorText: "#111111",
    colorDanger: "#b42318",
    fontFamily: "var(--font-manrope, Manrope, system-ui, sans-serif)",
    fontSizeBase: "14px",
    borderRadius: "8px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e7e1d8",
      borderRadius: "8px",
      minHeight: "44px",
      padding: "10px 16px",
      fontSize: "14px",
      lineHeight: "22px",
    },
    ".Input:focus": {
      borderColor: "#1a6b5a",
      boxShadow: "0 0 0 1px rgba(26, 107, 90, 0.2)",
      outline: "none",
    },
    ".Label": {
      fontSize: "12px",
      fontWeight: "500",
      lineHeight: "24px",
      letterSpacing: "0.12px",
      textTransform: "uppercase" as const,
      color: "#6b6b6b",
      marginBottom: "6px",
    },
    ".Tab": {
      border: "1px solid #e7e1d8",
      fontWeight: "500",
    },
  },
};

const MOBILE_STRIPE_APPEARANCE = {
  ...STRIPE_APPEARANCE,
  rules: {
    ...STRIPE_APPEARANCE.rules,
    ".Tab": {
      border: "1px solid rgba(17, 17, 17, 0.15)",
      borderRadius: "10px",
      padding: "11px 25px",
      fontSize: "10px",
      lineHeight: "15px",
      letterSpacing: "0.2px",
      fontWeight: "500",
    },
    ".Tab--selected": {
      borderColor: "#0a473b",
      color: "#0a473b",
    },
  },
};

type HairPaywallPageClientProps = {
  /** Server-resolved: URL `price_variant` → cookie/header → `customers.price_variant`. */
  resolvedPriceVariant: 149 | 79;
};

export default function HairPaywallPageClient({ resolvedPriceVariant }: HairPaywallPageClientProps) {
  const searchParams = useSearchParams();
  const desktopPrimaryCtaRef = useRef<HTMLDivElement | null>(null);
  const mobilePrimaryCtaRef = useRef<HTMLDivElement | null>(null);
  const [desktopTestimonialStart, setDesktopTestimonialStart] = useState(0);
  const [mobileTestimonialStart, setMobileTestimonialStart] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [hasPassedPrimaryCta, setHasPassedPrimaryCta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [includedOpen, setIncludedOpen] = useState(true);
  const checkoutInitiateEventSentRef = useRef(false);

  const customerId = searchParams.get("customer_id") ?? "";
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const nameRaw = searchParams.get("name")?.trim() ?? "";
  const name = nameRaw || (email.includes("@") ? email.split("@")[0] ?? "Member" : "Member");

  const priceVariant = resolvedPriceVariant;

  const paywallHref = useMemo(() => {
    if (!customerId || !email) return "/get-started";
    const params = new URLSearchParams();
    params.set("customer_id", customerId);
    params.set("email", email);
    params.set("name", name);
    if (phone) params.set("phone", phone);
    params.set("price_variant", String(priceVariant));
    return `/paywall?${params.toString()}`;
  }, [customerId, email, name, phone, priceVariant]);

  const displayPrice = useMemo(() => `$${priceVariant}`, [priceVariant]);

  const orderedTestimonials = useMemo(
    () =>
      testimonials.map((_, index) => testimonials[(desktopTestimonialStart + index) % testimonials.length]),
    [desktopTestimonialStart],
  );

  const orderedMobileTestimonials = useMemo(
    () =>
      testimonials.map((_, index) => testimonials[(mobileTestimonialStart + index) % testimonials.length]),
    [mobileTestimonialStart],
  );

  const handleDesktopPrev = () => {
    setDesktopTestimonialStart((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleDesktopNext = () => {
    setDesktopTestimonialStart((prev) => (prev + 1) % testimonials.length);
  };

  const handleMobilePrev = () => {
    setMobileTestimonialStart((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleMobileNext = () => {
    setMobileTestimonialStart((prev) => (prev + 1) % testimonials.length);
  };

  useEffect(() => {
    if (!customerId || !email) return;
    setCheckoutError("");
    setClientSecret(null);
    fetch("/api/v4/paywall-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: customerId,
        email,
        name,
        phone,
        price_variant: String(priceVariant),
        ...getClientNetworkContext(),
        ...getAffiliateAttribution(),
        ...getClickflareAttribution(),
        ...getUTMParams(true),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setCheckoutError(data.error || "Could not load checkout. Please try again.");
        }
      })
      .catch(() => setCheckoutError("Could not load checkout. Please try again."));
  }, [customerId, email, name, phone, priceVariant]);

  useEffect(() => {
    if (!customerId) return;
    if (checkoutInitiateEventSentRef.current) return;
    checkoutInitiateEventSentRef.current = true;
    void (async () => {
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
        event: "hair_initiate_checkout",
        ...(Object.keys(user_data).length > 0 ? { user_data } : {}),
      });
    })().catch((error) => {
      console.error("[GTM] Failed to push hair_initiate_checkout user_data:", error);
      pushToDataLayer({ event: "hair_initiate_checkout" });
    });
  }, [customerId, email, name, phone]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    setShowStickyCta(false);
    setHasPassedPrimaryCta(false);
  }, [isMobile]);

  useEffect(() => {
    const el = isMobile ? mobilePrimaryCtaRef.current : desktopPrimaryCtaRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStickyCta(false);
          return;
        }
        setShowStickyCta(hasPassedPrimaryCta && hasUserScrolled);
      },
      { root: null, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, hasPassedPrimaryCta, hasUserScrolled]);

  useEffect(() => {
    const getTarget = () => (isMobile ? mobilePrimaryCtaRef.current : desktopPrimaryCtaRef.current);

    const updatePassedState = () => {
      const target = getTarget();
      if (!target) return;
      const rect = target.getBoundingClientRect();
      setHasPassedPrimaryCta(rect.bottom < 0);
    };

    updatePassedState();
    window.addEventListener("scroll", updatePassedState, { passive: true });
    window.addEventListener("resize", updatePassedState);
    return () => {
      window.removeEventListener("scroll", updatePassedState);
      window.removeEventListener("resize", updatePassedState);
    };
  }, [isMobile]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) setHasUserScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className={`${styles.page} ${showStickyCta ? styles.pageWithStickyInset : ""}`}>
      <div className={styles.desktopView}>
        <header className={styles.header} >
          <Link href="/" className={styles.back}>
        <svg width="177" height="16" viewBox="0 0 177 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.47781 0.800014L10.9578 13.08C11.5378 14.7 11.9378 15.32 12.7778 15.4V15.64H6.85781V15.4C8.03781 15.32 8.39781 14.74 8.01781 13.62L7.15781 11.16H2.95781L2.79781 11.6C1.95781 13.94 2.13781 15.14 3.43781 15.4V15.64H-0.00218751V15.4C0.697813 15.14 1.25781 13.88 2.11781 11.48L5.97781 0.800014H6.47781ZM5.07781 5.26001L3.21781 10.42H6.89781L5.07781 5.26001ZM21.1361 12.9L21.4961 13.12C20.6761 14.5 19.4361 15.88 17.1961 15.88C14.1961 15.88 12.6361 13.44 12.6361 10.58C12.6361 7.40001 14.7161 4.92001 17.6761 4.92001C20.1961 4.92001 21.6361 6.64001 21.4761 9.32001H15.4761C15.4761 12.42 16.3761 14.32 18.5361 14.32C19.6961 14.32 20.5361 13.62 21.1361 12.9ZM17.5961 5.44001C16.2161 5.44001 15.5961 6.94001 15.4961 8.72001H18.9961C19.1561 6.58001 18.8561 5.44001 17.5961 5.44001ZM25.5464 15.88C24.5664 15.88 23.3264 15.68 22.5664 15.34L22.3864 12.44H22.6264C23.4664 14.1 24.3064 15.36 25.8864 15.36C26.9064 15.36 27.7264 14.82 27.7264 13.84C27.7264 12.86 27.0464 12.42 25.6464 11.68L24.8664 11.26C24.0064 10.8 22.6264 10.06 22.6264 8.16001C22.6264 6.10001 24.2664 4.92001 26.3264 4.92001C27.1264 4.92001 28.3664 5.10001 29.1864 5.42001V7.84001H28.9464C28.2864 6.40001 27.4264 5.44001 26.1464 5.44001C25.1464 5.44001 24.5664 6.02001 24.5664 6.80001C24.5664 7.90001 25.5064 8.38001 26.1264 8.70001L26.9064 9.12001C28.2664 9.84001 29.6864 10.5 29.6864 12.44C29.6864 14.56 28.0064 15.88 25.5464 15.88ZM37.3519 13.76L37.6519 14.08C36.7119 15.16 35.3719 15.88 34.1319 15.88C32.5119 15.88 31.5519 15.06 31.5519 13.06V6.14001H30.5119V5.58001L30.7919 5.44001C32.2119 4.78001 33.1319 3.94001 34.1119 2.18001H34.3519V5.16001H37.5119L37.1719 6.14001H34.3519V12.9C34.3519 13.94 34.8519 14.46 35.7519 14.46C36.3519 14.46 36.8919 14.14 37.3519 13.76ZM47.7622 8.04001V13.44C47.7622 14.72 47.8222 15.4 48.6422 15.4V15.64H44.0822V15.4C44.9022 15.4 44.9622 14.72 44.9622 13.44V8.76001C44.9622 7.38001 44.7222 6.50001 43.4222 6.50001C42.8622 6.50001 42.1222 6.74001 41.5222 7.14001V13.44C41.5222 14.72 41.5822 15.4 42.4022 15.4V15.64H37.8422V15.4C38.6622 15.4 38.7222 14.72 38.7222 13.44V2.76001C38.7222 1.48001 38.3822 1.12001 37.7022 0.880014V0.640013L41.3622 1.33514e-05H41.5222V6.58001C42.5222 5.64001 43.8422 4.92001 45.1622 4.92001C46.8822 4.92001 47.7622 6.04001 47.7622 8.04001ZM58.0103 12.9L58.3703 13.12C57.5503 14.5 56.3103 15.88 54.0703 15.88C51.0703 15.88 49.5103 13.44 49.5103 10.58C49.5103 7.40001 51.5903 4.92001 54.5503 4.92001C57.0703 4.92001 58.5103 6.64001 58.3503 9.32001H52.3503C52.3503 12.42 53.2503 14.32 55.4103 14.32C56.5703 14.32 57.4103 13.62 58.0103 12.9ZM54.4703 5.44001C53.0903 5.44001 52.4703 6.94001 52.3703 8.72001H55.8703C56.0303 6.58001 55.7303 5.44001 54.4703 5.44001ZM65.9206 13.76L66.2206 14.08C65.2806 15.16 63.9406 15.88 62.7006 15.88C61.0806 15.88 60.1206 15.06 60.1206 13.06V6.14001H59.0806V5.58001L59.3606 5.44001C60.7806 4.78001 61.7006 3.94001 62.6806 2.18001H62.9206V5.16001H66.0806L65.7406 6.14001H62.9206V12.9C62.9206 13.94 63.4206 14.46 64.3206 14.46C64.9206 14.46 65.4606 14.14 65.9206 13.76ZM68.6109 3.60001C67.7109 3.60001 67.0109 2.90001 67.0109 2.00001C67.0109 1.14001 67.7109 0.420014 68.6109 0.420014C69.4709 0.420014 70.1909 1.14001 70.1909 2.00001C70.1909 2.90001 69.4709 3.60001 68.6109 3.60001ZM71.0109 15.64H66.4509V15.4C67.2709 15.4 67.3309 14.72 67.3309 13.44V7.88001C67.3309 6.60001 66.9909 6.24001 66.3109 6.00001V5.76001L69.9709 4.96001H70.1309V13.44C70.1309 14.72 70.1909 15.4 71.0109 15.4V15.64ZM76.5058 15.88C73.5258 15.88 71.9658 13.44 71.9658 10.58C71.9658 7.38001 74.0458 4.92001 77.0058 4.92001C78.4658 4.92001 79.7258 5.64001 80.4858 6.56001L79.3258 8.26001H79.0858C78.7658 6.68001 78.2858 5.44001 77.0058 5.44001C75.5658 5.44001 74.8058 6.96001 74.8058 9.50001C74.8058 12.38 75.8058 14.28 77.7458 14.28C78.9458 14.28 79.7258 13.58 80.3258 12.82L80.6858 13.04C79.8858 14.44 78.7258 15.88 76.5058 15.88ZM95.6516 3.68001L96.1716 13.04C96.2516 14.52 96.3316 15.4 97.6916 15.4V15.64H91.9116V15.4C93.2716 15.4 93.3516 14.52 93.2716 13.04L92.7316 3.22001L88.4716 15.64H87.9916L83.3316 3.16001L82.8916 11.48C82.7516 13.84 83.3716 15.36 84.5316 15.4V15.64H80.6516V15.4C81.7316 15.3 82.0916 13.82 82.2116 11.48L82.6316 3.40001C82.7116 1.96001 82.0316 1.48001 81.1916 1.32001V1.08001H85.6916L89.3516 11.02L92.7716 1.08001H97.0916V1.32001C95.7316 1.44001 95.5716 2.20001 95.6516 3.68001ZM107.128 14.18L107.408 14.44C107.088 14.92 106.268 15.88 104.928 15.88C103.708 15.88 103.368 15.08 103.268 14.4C102.548 15.3 101.328 15.88 100.188 15.88C98.808 15.88 97.848 15.04 97.848 13.68C97.848 12.14 98.948 10.98 101.308 10.32L103.128 9.80001V8.64001C103.128 8.08001 103.128 6.26001 101.268 6.26001C100.028 6.26001 99.088 7.08001 98.548 8.08001L98.148 7.92001C98.668 6.30001 100.268 4.92001 102.548 4.92001C104.668 4.92001 105.868 6.26001 105.868 8.44001V13.22C105.868 13.88 105.868 14.48 106.448 14.48C106.728 14.48 106.968 14.34 107.128 14.18ZM101.748 14.54C102.248 14.54 102.748 14.3 103.128 13.96V10.34L102.308 10.64C101.308 11.02 100.468 11.48 100.468 12.9C100.468 14.02 101.048 14.54 101.748 14.54ZM114.421 13.76L114.721 14.08C113.781 15.16 112.441 15.88 111.201 15.88C109.581 15.88 108.621 15.06 108.621 13.06V6.14001H107.581V5.58001L107.861 5.44001C109.281 4.78001 110.201 3.94001 111.181 2.18001H111.421V5.16001H114.581L114.241 6.14001H111.421V12.9C111.421 13.94 111.921 14.46 112.821 14.46C113.421 14.46 113.961 14.14 114.421 13.76ZM119.357 15.88C116.377 15.88 114.817 13.44 114.817 10.58C114.817 7.38001 116.897 4.92001 119.857 4.92001C121.317 4.92001 122.577 5.64001 123.337 6.56001L122.177 8.26001H121.937C121.617 6.68001 121.137 5.44001 119.857 5.44001C118.417 5.44001 117.657 6.96001 117.657 9.50001C117.657 12.38 118.657 14.28 120.597 14.28C121.797 14.28 122.577 13.58 123.177 12.82L123.537 13.04C122.737 14.44 121.577 15.88 119.357 15.88ZM133.996 8.04001V13.44C133.996 14.72 134.056 15.4 134.876 15.4V15.64H130.316V15.4C131.136 15.4 131.196 14.72 131.196 13.44V8.76001C131.196 7.38001 130.956 6.50001 129.656 6.50001C129.096 6.50001 128.356 6.74001 127.756 7.14001V13.44C127.756 14.72 127.816 15.4 128.636 15.4V15.64H124.076V15.4C124.896 15.4 124.956 14.72 124.956 13.44V2.76001C124.956 1.48001 124.616 1.12001 123.936 0.880014V0.640013L127.596 1.33514e-05H127.756V6.58001C128.756 5.64001 130.076 4.92001 131.396 4.92001C133.116 4.92001 133.996 6.04001 133.996 8.04001ZM153.193 1.08001V1.32001C151.833 1.32001 151.753 2.32001 151.753 3.80001V12.98C151.753 14.46 151.833 15.4 153.193 15.4V15.64H147.353V15.4C148.713 15.4 148.793 14.46 148.793 12.98V8.48001H144.013V12.98C144.013 14.46 144.093 15.4 145.453 15.4V15.64H139.613V15.4C140.973 15.4 141.053 14.46 141.053 12.98V3.80001C141.053 2.32001 140.973 1.32001 139.613 1.32001V1.08001H145.453V1.32001C144.093 1.32001 144.013 2.32001 144.013 3.80001V7.76001H148.793V3.80001C148.793 2.32001 148.713 1.32001 147.353 1.32001V1.08001H153.193ZM162.918 14.18L163.198 14.44C162.878 14.92 162.058 15.88 160.718 15.88C159.498 15.88 159.158 15.08 159.058 14.4C158.338 15.3 157.118 15.88 155.978 15.88C154.598 15.88 153.638 15.04 153.638 13.68C153.638 12.14 154.738 10.98 157.098 10.32L158.918 9.80001V8.64001C158.918 8.08001 158.918 6.26001 157.058 6.26001C155.818 6.26001 154.878 7.08001 154.338 8.08001L153.938 7.92001C154.458 6.30001 156.058 4.92001 158.338 4.92001C160.458 4.92001 161.658 6.26001 161.658 8.44001V13.22C161.658 13.88 161.658 14.48 162.238 14.48C162.518 14.48 162.758 14.34 162.918 14.18ZM157.538 14.54C158.038 14.54 158.538 14.3 158.918 13.96V10.34L158.098 10.64C157.098 11.02 156.258 11.48 156.258 12.9C156.258 14.02 156.838 14.54 157.538 14.54ZM165.767 3.60001C164.867 3.60001 164.167 2.90001 164.167 2.00001C164.167 1.14001 164.867 0.420014 165.767 0.420014C166.627 0.420014 167.347 1.14001 167.347 2.00001C167.347 2.90001 166.627 3.60001 165.767 3.60001ZM168.167 15.64H163.607V15.4C164.427 15.4 164.487 14.72 164.487 13.44V7.88001C164.487 6.60001 164.147 6.24001 163.467 6.00001V5.76001L167.127 4.96001H167.287V13.44C167.287 14.72 167.347 15.4 168.167 15.4V15.64ZM175.542 4.92001C175.802 4.92001 176.082 4.96001 176.362 5.08001L175.782 7.64001H175.582C175.062 7.06001 174.462 6.84001 173.942 6.84001C173.522 6.84001 173.122 6.98001 172.702 7.36001V13.44C172.702 14.72 172.762 15.4 173.582 15.4V15.64H169.022V15.4C169.842 15.4 169.902 14.72 169.902 13.44V7.88001C169.902 6.60001 169.562 6.24001 168.882 6.00001V5.76001L172.542 4.96001H172.702V6.80001C173.542 5.64001 174.502 4.92001 175.542 4.92001Z" fill="#111111"/>
</svg>
</Link>
        </header>

        <div className={styles.main}>
          <Link href="/get-started" className={styles.back}>
            <span aria-hidden>←</span>
            Back
          </Link>

          <div className={styles.stack}>
            <div className={styles.splitTop}>
              <div className={styles.leftCol}>
                <section className={styles.promo}>
                  <div className={styles.promoIcon}>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="44" height="44" rx="22" fill="#1A2332"/>
<path d="M20.7438 13.8583L16.5854 15.425C15.6271 15.7833 14.8438 16.9166 14.8438 17.9333V24.125C14.8438 25.1083 15.4937 26.4 16.2854 26.9916L19.8688 29.6666C21.0438 30.55 22.9771 30.55 24.1521 29.6666L27.7354 26.9916C28.5271 26.4 29.1771 25.1083 29.1771 24.125V17.9333C29.1771 16.9083 28.3938 15.775 27.4354 15.4166L23.2771 13.8583C22.5688 13.6 21.4354 13.6 20.7438 13.8583Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5391 21.8917L20.8807 23.2334L24.4641 19.65" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                  </div>
                  <div>
                    <p className={styles.promoTitle}>End the trial and error</p>
                    <p className={styles.promoSub}>Diagnose first. Execute the path that works for your case.</p>
                  </div>
                </section>

                <section className={`${styles.card} ${styles.checkout}`}>
                  {checkoutError ? (
                    <p className={styles.formError}>{checkoutError}</p>
                  ) : !clientSecret ? (
                    <div className={styles.formSkeleton} aria-label="Loading checkout..." />
                  ) : (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: STRIPE_APPEARANCE } as StripeElementsOptions}
                    >
                      <div ref={desktopPrimaryCtaRef}>
                        <PaymentForm
                          customerId={customerId}
                          email={email}
                          name={name}
                          phone={phone}
                          price={priceVariant}
                          variant="desktop"
                          className={styles.embeddedPaymentShell}
                  isHairPaywall={true}

                        />
                      </div>
                    </Elements>
                  )}
                </section>

                <section className={styles.guarantee}>
                  <p className={styles.gKicker}>AestheticMatch Guarantee</p>
                  <p className={styles.gTitle}>
                    We don&apos;t stop until
                    <br />
                    something works.
                  </p>
                  <p className={styles.gText}>
                    If the first plan doesn&apos;t get results, your concierge adjusts it. New protocol, new path, new
                    approach — we keep going until your hair is solved. Plus a 7-day refund window if your report
                    doesn&apos;t deliver clarity.
                  </p>
                </section>
              </div>

              <div className={styles.rightCol}>
  
                <section className={`${styles.card} ${styles.included}`}>
                  <button
                    type="button"
                    className={styles.includedHead}
                    onClick={() => setIncludedOpen((o) => !o)}
                    aria-expanded={includedOpen}
                  >
                    <div>
                      <div className={styles.includedGiftRow}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 7.33333V19.25M11 7.33333C10.6684 5.96695 10.0975 4.79921 9.36167 3.98163C8.62586 3.16406 7.7593 2.73499 6.875 2.7504C6.26721 2.7504 5.68432 2.99184 5.25455 3.42161C4.82478 3.85139 4.58333 4.43428 4.58333 5.04207C4.58333 5.64986 4.82478 6.23275 5.25455 6.66252C5.68432 7.09229 6.26721 7.33373 6.875 7.33373M11 7.33333C11.3316 5.96695 11.9025 4.79921 12.6383 3.98163C13.3741 3.16406 14.2407 2.73499 15.125 2.7504C15.7328 2.7504 16.3157 2.99184 16.7455 3.42161C17.1752 3.85139 17.4167 4.43428 17.4167 5.04207C17.4167 5.64986 17.1752 6.23275 16.7455 6.66252C16.3157 7.09229 15.7328 7.33373 15.125 7.33373M17.4167 11V17.4167C17.4167 17.9029 17.2235 18.3692 16.8797 18.713C16.5359 19.0568 16.0696 19.25 15.5833 19.25H6.41667C5.93044 19.25 5.46412 19.0568 5.1203 18.713C4.77649 18.3692 4.58333 17.9029 4.58333 17.4167V11M2.75 8.25C2.75 8.00688 2.84658 7.77373 3.01849 7.60182C3.19039 7.42991 3.42355 7.33333 3.66667 7.33333H18.3333C18.5764 7.33333 18.8096 7.42991 18.9815 7.60182C19.1534 7.77373 19.25 8.00688 19.25 8.25V10.0833C19.25 10.3264 19.1534 10.5596 18.9815 10.7315C18.8096 10.9034 18.5764 11 18.3333 11H3.66667C3.42355 11 3.19039 10.9034 3.01849 10.7315C2.84658 10.5596 2.75 10.3264 2.75 10.0833V8.25Z" stroke="#C4693C" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<p className={styles.includedTitle}>See what&apos;s included</p>

                      </div>
                      <p className={styles.includedMeta}>7 services · $682 value · yours for {displayPrice}</p>
                    </div>
                    <span
                      className={`${styles.includedChevron} ${includedOpen ? styles.includedChevronOpen : ""}`}
                      aria-hidden
                    >
                      ⌄
                    </span>
                  </button>
                  {includedOpen ? (
                    <>
                      <hr className={styles.includedRule} />

                      <div className={styles.includedList}>
                        {includedItems.map(([title, desc, price, icon]) => (
                          <div key={title} className={styles.includedRow}>
                            <div className={styles.includedIconWrap}>
                              <img src={icon} alt="" />
                            </div>
                            <div className={styles.includedText}>
                              <h4>{title}</h4>
                              <p>{desc}</p>
                            </div>
                            <div className={styles.includedPrice}>
                              <s>{price}</s>
                              <p>Included</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.includedFoot}>
                        <strong>Total value</strong>
                        <div className={styles.includedFootRight}>
                          <s>$682</s>
                          <span>Yours For {displayPrice}</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </section>
              </div>
            </div>

            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h3>{displayPrice} today saves you years of trial and error.</h3>
                <p>The math, plainly.</p>
              </div>
              <hr className={styles.sectionRule} />

              <div className={styles.mathCols}>
                <article className={styles.mathCard}>
                  <div className={styles.mathBadge}>WITHOUT US</div>
                  <div className={styles.mathList}>
                    <div className={styles.mathItem}>
                      <p className={styles.mathValue}>$5,000+</p>
                      <p className={styles.mathDesc}>Spent on supplements, wrong meds, and ineffective topicals</p>
                    </div>
                    <div className={styles.mathItem}>
                      <p className={styles.mathValue}>Trial and error</p>
                      <p className={styles.mathDesc}>1-3 years of lost ground while testing what doesn&apos;t work</p>
                    </div>
                    <div className={styles.mathItem}>
                      <p className={styles.mathValue}>$20,000+</p>
                      <p className={styles.mathDesc}>Wrong transplant, wrong technique, donor capacity wasted</p>
                    </div>
                  </div>
                </article>

                <article className={styles.mathCard}>
                  <div className={styles.mathBadge}>WITH AESTHETICMATCH</div>
                  <div className={styles.mathList}>
                    <div className={styles.mathItem}>
                      <p className={styles.mathValue}>{displayPrice}</p>
                      <p className={styles.mathDesc}>One report. The right path. Days, not years.</p>
                    </div>
                    <div className={styles.mathItem}>
                      <p className={styles.mathValue}>Right protocol first</p>
                      <p className={styles.mathDesc}>Your biology, not someone else&apos;s marketing</p>
                    </div>
                    <div className={styles.mathItem}>
                      <p className={styles.mathValue}>Vetted only</p>
                      <p className={styles.mathDesc}>60+ surgeons in our network. Most don&apos;t make our cut.</p>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section className={styles.subSection}>
              <div className={styles.subSectionHead}>
                <p>What Members Say</p>
                <div className={styles.arrows}>
                  <button type="button" className={styles.arrow} onClick={handleDesktopPrev} aria-label="Previous testimonial">
                    ←
                  </button>
                  <button type="button" className={styles.arrow} onClick={handleDesktopNext} aria-label="Next testimonial">
                    →
                  </button>
                </div>
              </div>
              <hr className={styles.sectionRule} />

              <div className={styles.testiGrid}>
                {orderedTestimonials.map(([label, quote, name, detail, avatar]) => (
                  <article key={name} className={styles.testiCard}>
                    <p className={styles.stars}>★★★★★</p>
                    <p className={styles.label10}>{label}</p>
                    <p className={styles.quote}>{quote}</p>
                    <div className={styles.author}>
                      <img className={styles.avatar} src={avatar} alt="" />
                      <div>
                        <p className={styles.authorName}>{name}</p>
                        <p className={styles.authorMeta}>{detail}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.subSection}>
              <h3 className={styles.faqTitle}>FREQUENTLY ASKED</h3>
              <hr className={styles.sectionRule} />
              <div className={styles.faqList}>
                {faqs.map(([q, a], idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <article key={q} className={styles.faqItem}>
                      <button
                        type="button"
                        className={styles.faqQRow}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                      >
                        <span className={styles.faqQ}>{q}</span>
                        <span className={isOpen ? styles.faqCaretUp : styles.faqCaret} aria-hidden>
                          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                            <path
                              d="M7 10L12 15L17 10"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>
                      {isOpen ? <p className={styles.faqA}>{a}</p> : null}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className={styles.report}>
              <img
                className={styles.cover}
                src="/hair/paywall/report-cover-desktop.png"
                alt="Report cover"
              />
              <div className={styles.reportBody}>
                <h3>What&apos;s inside your report</h3>
                <p>Each assessment is built around your specific case — not a generic template.</p>
                <ul className={styles.reportList}>
                  {reportBullets.map((item) => (
                    <li key={item}>
                      <img src="/paywall/check.svg" alt="" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>

      <div className={styles.mobileView}>
        <header className={styles.mobileHeader}>
        <svg width="177" height="16" viewBox="0 0 177 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.47781 0.800014L10.9578 13.08C11.5378 14.7 11.9378 15.32 12.7778 15.4V15.64H6.85781V15.4C8.03781 15.32 8.39781 14.74 8.01781 13.62L7.15781 11.16H2.95781L2.79781 11.6C1.95781 13.94 2.13781 15.14 3.43781 15.4V15.64H-0.00218751V15.4C0.697813 15.14 1.25781 13.88 2.11781 11.48L5.97781 0.800014H6.47781ZM5.07781 5.26001L3.21781 10.42H6.89781L5.07781 5.26001ZM21.1361 12.9L21.4961 13.12C20.6761 14.5 19.4361 15.88 17.1961 15.88C14.1961 15.88 12.6361 13.44 12.6361 10.58C12.6361 7.40001 14.7161 4.92001 17.6761 4.92001C20.1961 4.92001 21.6361 6.64001 21.4761 9.32001H15.4761C15.4761 12.42 16.3761 14.32 18.5361 14.32C19.6961 14.32 20.5361 13.62 21.1361 12.9ZM17.5961 5.44001C16.2161 5.44001 15.5961 6.94001 15.4961 8.72001H18.9961C19.1561 6.58001 18.8561 5.44001 17.5961 5.44001ZM25.5464 15.88C24.5664 15.88 23.3264 15.68 22.5664 15.34L22.3864 12.44H22.6264C23.4664 14.1 24.3064 15.36 25.8864 15.36C26.9064 15.36 27.7264 14.82 27.7264 13.84C27.7264 12.86 27.0464 12.42 25.6464 11.68L24.8664 11.26C24.0064 10.8 22.6264 10.06 22.6264 8.16001C22.6264 6.10001 24.2664 4.92001 26.3264 4.92001C27.1264 4.92001 28.3664 5.10001 29.1864 5.42001V7.84001H28.9464C28.2864 6.40001 27.4264 5.44001 26.1464 5.44001C25.1464 5.44001 24.5664 6.02001 24.5664 6.80001C24.5664 7.90001 25.5064 8.38001 26.1264 8.70001L26.9064 9.12001C28.2664 9.84001 29.6864 10.5 29.6864 12.44C29.6864 14.56 28.0064 15.88 25.5464 15.88ZM37.3519 13.76L37.6519 14.08C36.7119 15.16 35.3719 15.88 34.1319 15.88C32.5119 15.88 31.5519 15.06 31.5519 13.06V6.14001H30.5119V5.58001L30.7919 5.44001C32.2119 4.78001 33.1319 3.94001 34.1119 2.18001H34.3519V5.16001H37.5119L37.1719 6.14001H34.3519V12.9C34.3519 13.94 34.8519 14.46 35.7519 14.46C36.3519 14.46 36.8919 14.14 37.3519 13.76ZM47.7622 8.04001V13.44C47.7622 14.72 47.8222 15.4 48.6422 15.4V15.64H44.0822V15.4C44.9022 15.4 44.9622 14.72 44.9622 13.44V8.76001C44.9622 7.38001 44.7222 6.50001 43.4222 6.50001C42.8622 6.50001 42.1222 6.74001 41.5222 7.14001V13.44C41.5222 14.72 41.5822 15.4 42.4022 15.4V15.64H37.8422V15.4C38.6622 15.4 38.7222 14.72 38.7222 13.44V2.76001C38.7222 1.48001 38.3822 1.12001 37.7022 0.880014V0.640013L41.3622 1.33514e-05H41.5222V6.58001C42.5222 5.64001 43.8422 4.92001 45.1622 4.92001C46.8822 4.92001 47.7622 6.04001 47.7622 8.04001ZM58.0103 12.9L58.3703 13.12C57.5503 14.5 56.3103 15.88 54.0703 15.88C51.0703 15.88 49.5103 13.44 49.5103 10.58C49.5103 7.40001 51.5903 4.92001 54.5503 4.92001C57.0703 4.92001 58.5103 6.64001 58.3503 9.32001H52.3503C52.3503 12.42 53.2503 14.32 55.4103 14.32C56.5703 14.32 57.4103 13.62 58.0103 12.9ZM54.4703 5.44001C53.0903 5.44001 52.4703 6.94001 52.3703 8.72001H55.8703C56.0303 6.58001 55.7303 5.44001 54.4703 5.44001ZM65.9206 13.76L66.2206 14.08C65.2806 15.16 63.9406 15.88 62.7006 15.88C61.0806 15.88 60.1206 15.06 60.1206 13.06V6.14001H59.0806V5.58001L59.3606 5.44001C60.7806 4.78001 61.7006 3.94001 62.6806 2.18001H62.9206V5.16001H66.0806L65.7406 6.14001H62.9206V12.9C62.9206 13.94 63.4206 14.46 64.3206 14.46C64.9206 14.46 65.4606 14.14 65.9206 13.76ZM68.6109 3.60001C67.7109 3.60001 67.0109 2.90001 67.0109 2.00001C67.0109 1.14001 67.7109 0.420014 68.6109 0.420014C69.4709 0.420014 70.1909 1.14001 70.1909 2.00001C70.1909 2.90001 69.4709 3.60001 68.6109 3.60001ZM71.0109 15.64H66.4509V15.4C67.2709 15.4 67.3309 14.72 67.3309 13.44V7.88001C67.3309 6.60001 66.9909 6.24001 66.3109 6.00001V5.76001L69.9709 4.96001H70.1309V13.44C70.1309 14.72 70.1909 15.4 71.0109 15.4V15.64ZM76.5058 15.88C73.5258 15.88 71.9658 13.44 71.9658 10.58C71.9658 7.38001 74.0458 4.92001 77.0058 4.92001C78.4658 4.92001 79.7258 5.64001 80.4858 6.56001L79.3258 8.26001H79.0858C78.7658 6.68001 78.2858 5.44001 77.0058 5.44001C75.5658 5.44001 74.8058 6.96001 74.8058 9.50001C74.8058 12.38 75.8058 14.28 77.7458 14.28C78.9458 14.28 79.7258 13.58 80.3258 12.82L80.6858 13.04C79.8858 14.44 78.7258 15.88 76.5058 15.88ZM95.6516 3.68001L96.1716 13.04C96.2516 14.52 96.3316 15.4 97.6916 15.4V15.64H91.9116V15.4C93.2716 15.4 93.3516 14.52 93.2716 13.04L92.7316 3.22001L88.4716 15.64H87.9916L83.3316 3.16001L82.8916 11.48C82.7516 13.84 83.3716 15.36 84.5316 15.4V15.64H80.6516V15.4C81.7316 15.3 82.0916 13.82 82.2116 11.48L82.6316 3.40001C82.7116 1.96001 82.0316 1.48001 81.1916 1.32001V1.08001H85.6916L89.3516 11.02L92.7716 1.08001H97.0916V1.32001C95.7316 1.44001 95.5716 2.20001 95.6516 3.68001ZM107.128 14.18L107.408 14.44C107.088 14.92 106.268 15.88 104.928 15.88C103.708 15.88 103.368 15.08 103.268 14.4C102.548 15.3 101.328 15.88 100.188 15.88C98.808 15.88 97.848 15.04 97.848 13.68C97.848 12.14 98.948 10.98 101.308 10.32L103.128 9.80001V8.64001C103.128 8.08001 103.128 6.26001 101.268 6.26001C100.028 6.26001 99.088 7.08001 98.548 8.08001L98.148 7.92001C98.668 6.30001 100.268 4.92001 102.548 4.92001C104.668 4.92001 105.868 6.26001 105.868 8.44001V13.22C105.868 13.88 105.868 14.48 106.448 14.48C106.728 14.48 106.968 14.34 107.128 14.18ZM101.748 14.54C102.248 14.54 102.748 14.3 103.128 13.96V10.34L102.308 10.64C101.308 11.02 100.468 11.48 100.468 12.9C100.468 14.02 101.048 14.54 101.748 14.54ZM114.421 13.76L114.721 14.08C113.781 15.16 112.441 15.88 111.201 15.88C109.581 15.88 108.621 15.06 108.621 13.06V6.14001H107.581V5.58001L107.861 5.44001C109.281 4.78001 110.201 3.94001 111.181 2.18001H111.421V5.16001H114.581L114.241 6.14001H111.421V12.9C111.421 13.94 111.921 14.46 112.821 14.46C113.421 14.46 113.961 14.14 114.421 13.76ZM119.357 15.88C116.377 15.88 114.817 13.44 114.817 10.58C114.817 7.38001 116.897 4.92001 119.857 4.92001C121.317 4.92001 122.577 5.64001 123.337 6.56001L122.177 8.26001H121.937C121.617 6.68001 121.137 5.44001 119.857 5.44001C118.417 5.44001 117.657 6.96001 117.657 9.50001C117.657 12.38 118.657 14.28 120.597 14.28C121.797 14.28 122.577 13.58 123.177 12.82L123.537 13.04C122.737 14.44 121.577 15.88 119.357 15.88ZM133.996 8.04001V13.44C133.996 14.72 134.056 15.4 134.876 15.4V15.64H130.316V15.4C131.136 15.4 131.196 14.72 131.196 13.44V8.76001C131.196 7.38001 130.956 6.50001 129.656 6.50001C129.096 6.50001 128.356 6.74001 127.756 7.14001V13.44C127.756 14.72 127.816 15.4 128.636 15.4V15.64H124.076V15.4C124.896 15.4 124.956 14.72 124.956 13.44V2.76001C124.956 1.48001 124.616 1.12001 123.936 0.880014V0.640013L127.596 1.33514e-05H127.756V6.58001C128.756 5.64001 130.076 4.92001 131.396 4.92001C133.116 4.92001 133.996 6.04001 133.996 8.04001ZM153.193 1.08001V1.32001C151.833 1.32001 151.753 2.32001 151.753 3.80001V12.98C151.753 14.46 151.833 15.4 153.193 15.4V15.64H147.353V15.4C148.713 15.4 148.793 14.46 148.793 12.98V8.48001H144.013V12.98C144.013 14.46 144.093 15.4 145.453 15.4V15.64H139.613V15.4C140.973 15.4 141.053 14.46 141.053 12.98V3.80001C141.053 2.32001 140.973 1.32001 139.613 1.32001V1.08001H145.453V1.32001C144.093 1.32001 144.013 2.32001 144.013 3.80001V7.76001H148.793V3.80001C148.793 2.32001 148.713 1.32001 147.353 1.32001V1.08001H153.193ZM162.918 14.18L163.198 14.44C162.878 14.92 162.058 15.88 160.718 15.88C159.498 15.88 159.158 15.08 159.058 14.4C158.338 15.3 157.118 15.88 155.978 15.88C154.598 15.88 153.638 15.04 153.638 13.68C153.638 12.14 154.738 10.98 157.098 10.32L158.918 9.80001V8.64001C158.918 8.08001 158.918 6.26001 157.058 6.26001C155.818 6.26001 154.878 7.08001 154.338 8.08001L153.938 7.92001C154.458 6.30001 156.058 4.92001 158.338 4.92001C160.458 4.92001 161.658 6.26001 161.658 8.44001V13.22C161.658 13.88 161.658 14.48 162.238 14.48C162.518 14.48 162.758 14.34 162.918 14.18ZM157.538 14.54C158.038 14.54 158.538 14.3 158.918 13.96V10.34L158.098 10.64C157.098 11.02 156.258 11.48 156.258 12.9C156.258 14.02 156.838 14.54 157.538 14.54ZM165.767 3.60001C164.867 3.60001 164.167 2.90001 164.167 2.00001C164.167 1.14001 164.867 0.420014 165.767 0.420014C166.627 0.420014 167.347 1.14001 167.347 2.00001C167.347 2.90001 166.627 3.60001 165.767 3.60001ZM168.167 15.64H163.607V15.4C164.427 15.4 164.487 14.72 164.487 13.44V7.88001C164.487 6.60001 164.147 6.24001 163.467 6.00001V5.76001L167.127 4.96001H167.287V13.44C167.287 14.72 167.347 15.4 168.167 15.4V15.64ZM175.542 4.92001C175.802 4.92001 176.082 4.96001 176.362 5.08001L175.782 7.64001H175.582C175.062 7.06001 174.462 6.84001 173.942 6.84001C173.522 6.84001 173.122 6.98001 172.702 7.36001V13.44C172.702 14.72 172.762 15.4 173.582 15.4V15.64H169.022V15.4C169.842 15.4 169.902 14.72 169.902 13.44V7.88001C169.902 6.60001 169.562 6.24001 168.882 6.00001V5.76001L172.542 4.96001H172.702V6.80001C173.542 5.64001 174.502 4.92001 175.542 4.92001Z" fill="#111111"/>
</svg>

        </header>

        <section className={styles.mobileSection}>
          <p className={styles.mobileKicker}>YOUR ASSESSMENT</p>
          <div className={styles.mobileGuarantee}>
            <p className={styles.mobileGk}>AestheticMatch Guarantee</p>
            <p className={styles.mobileGt}>
              We don&apos;t stop until
              <br />
              something works.
            </p>
            <p className={styles.mobileGd}>
              If the first plan doesn&apos;t get results, your concierge adjusts it. New protocol, new path, new
              approach — we keep going until your hair is solved. Plus a 7-day refund if your report doesn&apos;t deliver
              clarity.
            </p>
          </div>

          <div className={styles.mobilePriceBlock}>
            <p className={styles.mobilePrice}>{displayPrice}</p>
            <p className={styles.mobileOneTime}>One-Time · No Subscription</p>
            <p className={styles.mobileUnlock}>Unlocks $682 in concierge value</p>
            <div className={styles.mobilePills}>
              <span>HIPAA-aligned</span>
              <span>Board-certified</span>
              <span>$0 referral fees</span>
            </div>
          </div>

          <div className={styles.mobilePayCard}>
            {checkoutError ? (
              <p className={styles.formError}>{checkoutError}</p>
            ) : !clientSecret ? (
              <div className={styles.formSkeleton} aria-label="Loading checkout..." />
            ) : (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: MOBILE_STRIPE_APPEARANCE } as StripeElementsOptions}
              >
                <PaymentForm
                  customerId={customerId}
                  email={email}
                  name={name}
                  phone={phone}
                  price={priceVariant}
                  variant="mobile"
                  className={styles.embeddedPaymentShellMobile}
                  ctaSentinelRef={mobilePrimaryCtaRef}
                  isHairPaywall={true}
                />
              </Elements>
            )}
          </div>

          <div className={styles.mobilePrimaryCtaWrap} />
        </section>

        <section className={styles.mobileSection}>
          <div className={styles.mobileIncludedCard}>
            <button
              type="button"
              className={styles.mobileIncludedHead}
              onClick={() => setIncludedOpen((o) => !o)}
              aria-expanded={includedOpen}
            >
              <div>
              <div className={styles.includedGiftRow}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 7.33333V19.25M11 7.33333C10.6684 5.96695 10.0975 4.79921 9.36167 3.98163C8.62586 3.16406 7.7593 2.73499 6.875 2.7504C6.26721 2.7504 5.68432 2.99184 5.25455 3.42161C4.82478 3.85139 4.58333 4.43428 4.58333 5.04207C4.58333 5.64986 4.82478 6.23275 5.25455 6.66252C5.68432 7.09229 6.26721 7.33373 6.875 7.33373M11 7.33333C11.3316 5.96695 11.9025 4.79921 12.6383 3.98163C13.3741 3.16406 14.2407 2.73499 15.125 2.7504C15.7328 2.7504 16.3157 2.99184 16.7455 3.42161C17.1752 3.85139 17.4167 4.43428 17.4167 5.04207C17.4167 5.64986 17.1752 6.23275 16.7455 6.66252C16.3157 7.09229 15.7328 7.33373 15.125 7.33373M17.4167 11V17.4167C17.4167 17.9029 17.2235 18.3692 16.8797 18.713C16.5359 19.0568 16.0696 19.25 15.5833 19.25H6.41667C5.93044 19.25 5.46412 19.0568 5.1203 18.713C4.77649 18.3692 4.58333 17.9029 4.58333 17.4167V11M2.75 8.25C2.75 8.00688 2.84658 7.77373 3.01849 7.60182C3.19039 7.42991 3.42355 7.33333 3.66667 7.33333H18.3333C18.5764 7.33333 18.8096 7.42991 18.9815 7.60182C19.1534 7.77373 19.25 8.00688 19.25 8.25V10.0833C19.25 10.3264 19.1534 10.5596 18.9815 10.7315C18.8096 10.9034 18.5764 11 18.3333 11H3.66667C3.42355 11 3.19039 10.9034 3.01849 10.7315C2.84658 10.5596 2.75 10.3264 2.75 10.0833V8.25Z" stroke="#C4693C" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<p className={styles.includedTitle}>See what&apos;s included</p>

                      </div>                <p className={styles.mobileIncludedMeta}>7 services · $682 value · yours for {displayPrice}</p>
              </div>
              <span
                className={`${styles.includedChevron} ${includedOpen ? styles.includedChevronOpen : ""}`}
                aria-hidden
              >
                ⌄
              </span>
            </button>
            {includedOpen ? (
              <>
                <hr />
                <div className={styles.mobileIncludedList}>
                  {includedItems.map(([title, desc, price]) => (
                    <div key={title} className={styles.mobileIncludedItem}>
                      <div>
                        <p>{title}</p>
                        <small>{desc}</small>
                      </div>
                      <div>
                        <s>{price}</s>
                        <small>Included</small>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
                <div className={styles.mobileIncludedFoot}>
                  <strong>Total value</strong>
                  <div>
                    <s>$682</s>
                    <span>Yours For {displayPrice}</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>

        <section className={styles.mobileSection}>
          <div className={styles.mobileMath}>
            <p className={styles.mobileMathTitle}>{displayPrice} today saves you years of trial and error.</p>
            <p className={styles.mobileMathSub}>The math, plainly.</p>
            <div className={styles.mobileMathCard}>
              <span>WITHOUT US</span>
              <h4>$5,000+</h4>
              <p>Spent on supplements, wrong meds, and ineffective topicals</p>
              <h4>Trial and error</h4>
              <p>1-3 years of lost ground while testing what doesn&apos;t work</p>
              <h4>$20,000+</h4>
              <p>Wrong transplant, wrong technique, donor capacity wasted</p>
            </div>
            <div className={styles.mobileMathCard}>
              <span>WITH AESTHETICMATCH</span>
              <h4>{displayPrice}</h4>
              <p>One report. The right path. Days, not years.</p>
              <h4>Right protocol first</h4>
              <p>Your biology, not someone else&apos;s marketing</p>
              <h4>Vetted only</h4>
              <p>60+ surgeons in our network. Most don&apos;t make our cut.</p>
            </div>
          </div>
        </section>

        <section className={styles.mobileTestimonials}>
          <div className={styles.mobileTestiHead}>
            <p>What members say</p>
            <div>
              <button type="button" onClick={handleMobilePrev} aria-label="Previous testimonial">
                ←
              </button>
              <button type="button" onClick={handleMobileNext} aria-label="Next testimonial">
                →
              </button>
            </div>
          </div>
          <div className={styles.mobileTestiRail}>
            {orderedMobileTestimonials.map(([label, quote, name, detail, avatar]) => (
              <article key={name} className={styles.mobileTestiCard}>
                <p className={styles.stars}>★★★★★</p>
                <p className={styles.label10}>{label}</p>
                <p className={styles.quote}>{quote}</p>
                <div className={styles.author}>
                  <img className={styles.avatar} src={avatar} alt="" />
                  <div>
                    <p className={styles.authorName}>{name}</p>
                    <p className={styles.authorMeta}>{detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.mobileSection}>
          <h3 className={styles.mobileFaqTitle}>FREQUENTLY ASKED</h3>
          <hr className={styles.mobileHr} />
          <div className={styles.mobileFaqList}>
            {faqs.map(([q, a], idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <article key={q} className={styles.mobileFaqItem}>
                  <button
                    type="button"
                    className={styles.mobileFaqRow}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.mobileFaqQ}>{q}</span>
                    <span className={isOpen ? styles.mobileFaqChevronOpen : styles.mobileFaqChevron} aria-hidden>
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth={1.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  {isOpen ? <p className={styles.mobileFaqA}>{a}</p> : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.mobileSection}>
          <div className={styles.mobileReport}>
            <img
              src="/hair/paywall/report-cover-mobile.png"
              alt="Report cover"
              className={styles.mobileReportCover}
            />
            <div>
              <p className={styles.mobileReportTitle}>What&apos;s inside your report</p>
              <p className={styles.mobileReportSub}>Each assessment is built around your specific case — not a generic template.</p>
              <ul className={styles.mobileReportList}>
                {reportBullets.map((item) => (
                  <li key={item}>
                    <img src="/paywall/check.svg" alt="" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </div>

      {showStickyCta ? (
        <div className={isMobile ? styles.mobileStickyCta : styles.desktopStickyCta}>
          <Link href={paywallHref} className={isMobile ? styles.mobileStickyBtn : styles.desktopStickyBtn}>
            Get My Assessment · {displayPrice}
          </Link>
          {isMobile ? (
            <div className={styles.mobileStickySubStack}>
              <div className={styles.mobileStickySubRow}>
                <p className={styles.mobileStickyGuarantee}>7-day money-back guarantee</p>
                <a href="/terms" className={styles.mobileStickyTerms}>
                  Terms
                </a>
              </div>
            </div>
          ) : (
            <p className={styles.desktopStickyMeta}>
              <span className={styles.dot}>•</span>
              <span className={styles.metaText}> HIPAA-aligned </span>
              <span className={styles.dot}>•</span>
              <span className={styles.metaText}> Encrypted </span>
              <span className={styles.dot}>•</span>
              <span className={styles.metaText}> $0 referral fees </span>
              <span className={styles.dot}>•</span>
              <span className={styles.metaText}> 7-day refund</span>
            </p>
          )}
        </div>
      ) : null}
    </main>
  );
}
