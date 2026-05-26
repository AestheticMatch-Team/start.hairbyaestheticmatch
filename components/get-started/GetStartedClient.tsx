"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import styles from "./get-started.module.scss";
import { getPreQuizVariant, storePreQuizVariant } from "@/lib/pre-quiz-variant";
import { getAffiliateAttribution } from "@/lib/affiliate-attribution";
import { getUTMParams } from "@/lib/utm-tracking";
import { getMetaClickIds } from "@/lib/meta-tracking";
import { getTikTokClickIds } from "@/lib/tiktok-tracking";
import { getRedditClickIds } from "@/lib/reddit-tracking";
import {
  persistClientNetworkContext,
  withClientNetworkContext,
} from "@/lib/client-network-context";
import { buildMetaEventUserData, splitFullNameToMetaFields } from "@/lib/meta-event-user-data";
import { pushToDataLayer } from "@/lib/gtm-tracking";
import { funnelStepHref } from "@/lib/funnel";
import { readHairPriceVariantCookie } from "@/lib/get-started-cookies";
import { normalizeSupportedPhone } from "@/lib/normalize-supported-phone";

type Status = "idle" | "loading" | "success" | "error";
type Mode = "signin" | "signup";
type View = "form" | "link_sent";
const ARROW_RIGHT_ICON_SRC = "/v4-design/icons/arrow-right.svg";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Props = {
  initialEmail?: string;
  initialMode?: Mode;
  variant?: "plastics" | "hair";
};

type PendingCustomerSignupResult = {
  customerId: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  actionLink?: string;
};

export default function GetStartedClient({
  initialEmail = "",
  initialMode = "signin",
  variant = "plastics",
}: Props) {
  const isHair = variant === "hair";
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [view, setView] = useState<View>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  const canSubmitSignup = useMemo(() => {
    if (status === "loading") return false;
    if (!fullName.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    if (!normalizeSupportedPhone(phone)) return false;
    return true;
  }, [email, fullName, phone, status]);

  const canSubmitSignIn = useMemo(() => {
    if (status === "loading") return false;
    return isValidEmail(email.trim());
  }, [email, status]);

  const createPendingCustomer = useCallback(
    async (
      fullNameValue: string,
      emailValue: string,
      phoneValue: string,
      funnel: Record<string, string | undefined>
    ) => {
      const signupRes = await fetch("/api/paywall-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullNameValue,
          email: emailValue,
          phone: phoneValue,
          funnel,
          public_origin:
            typeof window !== "undefined" ? window.location.origin : undefined,
        }),
      });
      const signupData = (await signupRes.json().catch(() => ({}))) as {
        customer_id?: string;
        client_ip_address?: string;
        client_user_agent?: string;
        action_link?: string | null;
        error?: string;
        code?: string;
      };
      if (signupRes.ok && signupData?.customer_id) {
        return {
          customerId: String(signupData.customer_id),
          clientIpAddress:
            typeof signupData.client_ip_address === "string"
              ? signupData.client_ip_address
              : undefined,
          clientUserAgent:
            typeof signupData.client_user_agent === "string"
              ? signupData.client_user_agent
              : undefined,
          actionLink:
            typeof signupData.action_link === "string" && signupData.action_link
              ? signupData.action_link
              : undefined,
        } satisfies PendingCustomerSignupResult;
      }
      const msg =
        typeof signupData?.error === "string"
          ? signupData.error
          : "Could not save your details. Please try again.";
      const err = new Error(msg) as Error & { code?: string };
      if (signupData?.code === "ACCOUNT_EXISTS" || signupRes.status === 409) {
        err.code = "ACCOUNT_EXISTS";
      }
      throw err;
    },
    []
  );

  const sendMagicLink = useCallback(
    async (targetEmail: string) => {
      /** Path-based funnel: Supabase may replace query string when appending `code`. */
      const callbackPath = isHair ? "/auth/callback/hair" : "/auth/callback";
      /**
       * Hair: use the API route so `emailRedirectTo` is built from the request `Host` header.
       * Next.js / the browser Supabase client can otherwise send `localhost` while the tab
       * is on `hair.localhost`, which makes the magic link open the plastics host.
       */
      if (isHair) {
        const res = await fetch("/api/auth/magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: targetEmail,
            redirectTo: callbackPath,
            funnel: "hair",
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          throw new Error(
            typeof data.error === "string" ? data.error : "Could not send sign-in link."
          );
        }
        return;
      }
      throw new Error("Plastics sign-in is not available on this host.");
    },
    [isHair],
  );

  const checkCustomer = useCallback(async (targetEmail: string) => {
    const res = await fetch("/api/auth/customer-exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || "Unable to verify your account right now.");
    }
    return data as { exists: boolean; paid?: boolean; customer_id?: string; name?: string; phone?: string };
  }, []);

  const handleMagicLinkSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setMessage("");
      const trimmedEmail = email.trim().toLowerCase();
      if (!isValidEmail(trimmedEmail)) {
        setStatus("error");
        setMessage("Please enter a valid email.");
        return;
      }

      try {
        const customer = await checkCustomer(trimmedEmail);
        if (!customer.exists) {
          setStatus("error");
          setMessage("No account found for this email. Please use Get started to create your account.");
          return;
        }
        await sendMagicLink(trimmedEmail);
        setSentEmail(trimmedEmail);
        setView("link_sent");
        setStatus("idle");
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    },
    [checkCustomer, email, sendMagicLink]
  );

  const handleSignup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setMessage("");

      const trimmedName = fullName.trim();
      const trimmedEmail = email.trim().toLowerCase();
      const normalizedPhone = normalizeSupportedPhone(phone);

      if (!trimmedName || !isValidEmail(trimmedEmail) || !normalizedPhone) {
        setStatus("error");
        setMessage("Please enter a valid phone number starting with +1, +90, or +91.");
        return;
      }

      try {
        const preQuizVariant = getPreQuizVariant(trimmedEmail);
        const { fbc, fbp } = getMetaClickIds();
        const { ttclid, ttp } = getTikTokClickIds();
        const { rdt_cid, rdt_uuid } = getRedditClickIds();
        const path = preQuizVariant === "variant" ? "/pre-quiz" : "/paywall";
        const hairPriceVariant = isHair ? readHairPriceVariantCookie() : undefined;
        const funnel: Record<string, string | undefined> = {
          ...getAffiliateAttribution(),
          ...getUTMParams(true),
          funnel: isHair ? "hair" : "plastics",
          pre_quiz_variant: preQuizVariant,
          next_path: path,
          price_variant:
            hairPriceVariant !== undefined ? String(hairPriceVariant) : undefined,
          ...(fbc ? { fbc } : {}),
          ...(fbp ? { fbp } : {}),
          ...(ttclid ? { ttclid } : {}),
          ...(ttp ? { ttp } : {}),
          ...(rdt_cid ? { rdt_cid } : {}),
          ...(rdt_uuid ? { rdt_uuid } : {}),
        };
        const signupResult = await createPendingCustomer(
          trimmedName,
          trimmedEmail,
          normalizedPhone,
          funnel
        );
        const customerId = signupResult.customerId;
        persistClientNetworkContext(
          signupResult.clientIpAddress,
          signupResult.clientUserAgent,
        );
        const { fn, ln } = splitFullNameToMetaFields(trimmedName);
        const user_data = await buildMetaEventUserData(
          withClientNetworkContext({
            em: trimmedEmail,
            ph: normalizedPhone,
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
          event: isHair ? "hair_complete_registration" : "complete_registration",
          ...(signupResult.clientIpAddress
            ? { client_ip_address: signupResult.clientIpAddress }
            : {}),
          ...(signupResult.clientUserAgent
            ? { client_user_agent: signupResult.clientUserAgent }
            : {}),
          ...(Object.keys(user_data).length > 0 ? { user_data } : {}),
        });
        const params = new URLSearchParams({
          customer_id: customerId,
          email: trimmedEmail,
          name: trimmedName,
          phone: normalizedPhone,
        });
        if (hairPriceVariant !== undefined) {
          params.set("price_variant", String(hairPriceVariant));
        }
        storePreQuizVariant(preQuizVariant);
        const qs = params.toString();

        // Preferred path: follow the Supabase action_link so the user lands on
        // session-bridge on this host (tokens in hash) → setSession → paywall/pre-quiz.
        // Same as main hair get-started; redirect_to is URL-encoded inside action_link.
        if (signupResult.actionLink) {
          window.location.href = signupResult.actionLink;
          return;
        }

        if (isHair) {
          window.location.href = funnelStepHref(path, qs);
        } else {
          router.push(`${path}?${qs}`);
        }
      } catch (err) {
        setStatus("error");
        const e = err as Error & { code?: string };
        if (e.code === "ACCOUNT_EXISTS") {
          setMessage(e.message);
          setMode("signin");
          setView("form");
        } else {
          setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
      }
    },
    [createPendingCustomer, email, fullName, isHair, phone, router]
  );

  const handleResend = useCallback(async () => {
    const targetEmail = (sentEmail || email).trim().toLowerCase();
    if (!isValidEmail(targetEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      setView("form");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      if (mode === "signin") {
        const customer = await checkCustomer(targetEmail);
        if (!customer.exists) {
          setStatus("error");
          setMessage("No account found for this email. Please use Get started to create your account.");
          setView("form");
          return;
        }
      }
      await sendMagicLink(targetEmail);
      setStatus("success");
      setMessage("A new magic link has been sent.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not resend link.");
    }
  }, [checkCustomer, email, mode, sendMagicLink, sentEmail]);

  const pageClass = [styles.page, isHair && styles.pageHair].filter(Boolean).join(" ");

  return (
    <main className={pageClass}>
      <section
        className={isHair ? `${styles.left} ${styles.leftHair}` : styles.left}
        aria-label={isHair ? "AestheticMatch Hair intro" : "AestheticMatch intro"}
      >
        <div className={styles.brand}>
          {isHair ? (
            <Link
              href="/"
              className={`${styles.brandLink} ${styles.brandLinkHair}`}
              aria-label="AestheticMatch Hair home"
            >
              <img
                src="/hair/hair_logo.png"
                alt=""
                width={40}
                height={40}
              />
              AestheticMatch Hair
            </Link>
          ) : (
            <Link href="/" className={styles.brandLink} aria-label="AestheticMatch home">
              <img
                src="/logo_white.svg"
                alt="AestheticMatch"
                width={133}
                height={17}
                className={styles.brandLogoDesktop}
              />
            </Link>
          )}
        </div>

        <div className={styles.leftContent}>
          {isHair ? (
            <>
              <h2 className={styles.leftTitle}>
                Find what works.
                <br />
                See your results.
              </h2>
              <p className={styles.leftSubtitle}>
                An independent analysis of your hair loss and what actually works — before you spend a
                dollar.
              </p>
            </>
          ) : (
            <>
              <h2 className={styles.leftTitle}>
                Find your surgeon.
                <br />
                See your results.
              </h2>
              <p className={styles.leftSubtitle}>
                An independent analysis of what you should know about your surgeon before you spend a
                dollar.
              </p>
            </>
          )}
        </div>
      </section>

      <section className={styles.right} aria-label="Get started form">
        <div className={styles.rightInner}>
          <div className={styles.formWrap}>
            {view === "link_sent" ? (
              <>
                <h1 className={styles.title}>Check your inbox</h1>
                <p className={styles.linkSentSubtitle}>
                  We sent a link to <strong>{sentEmail || email}</strong>.
                  <br />
                  {mode === "signin"
                    ? "Click it to sign in."
                    : "Click it to create your account and get started."}
                </p>

                <div className={styles.noticeBox}>
                  Can&apos;t find it? Check spam or promotions. Sent from
                  <br />
                  <strong>noreply@aestheticmatch.com</strong>
                </div>

                <div className={styles.linkSentActions}>
                  <button
                    type="button"
                    className={styles.linkSentResend}
                    onClick={handleResend}
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Resending..." : "Resend link"}
                  </button>

                  <button
                    type="button"
                    className={styles.linkSentBack}
                    onClick={() => {
                      setView("form");
                      setStatus("idle");
                      setMessage("");
                    }}
                  >
                    <span aria-hidden="true">‹</span>
                    Use a different email
                  </button>
                </div>

                <p className={styles.linkSentExpiry}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 8V12L14.75 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Link expires in 15 minutes
                </p>
              </>
            ) : mode === "signin" ? (
              <>
                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.subtitle}>
                  Enter your email and we&apos;ll send you a magic link to log in.
                </p>

                <form className={styles.form} onSubmit={handleMagicLinkSignIn} noValidate>
                  <div className={styles.fields}>
                    <div className={styles.field}>
                      <label htmlFor="signin-email" className={styles.label}>
                        Email address
                      </label>
                      <input
                        id="signin-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === "loading"}
                        className={styles.input}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="submit"
                      className={styles.continue}
                      disabled={status === "loading" || !isValidEmail(email.trim())}
                    >
                      <span>{status === "loading" ? "Sending…" : "Send magic link"}</span>
                      <span className={styles.continueIcon} aria-hidden="true">
                        <img src={ARROW_RIGHT_ICON_SRC} alt="" />
                      </span>
                    </button>
                  </div>

                  <p className={styles.loginRow}>
                    <span>{isHair ? "New to AestheticMatch Hair?" : "New to AestheticMatch?"}</span>{" "}
                    <button
                      type="button"
                      className={
                        isHair
                          ? `${styles.loginSwitch} ${styles.loginSwitchHair}`
                          : styles.loginSwitch
                      }
                      onClick={() => {
                        setMode("signup");
                        setView("form");
                        setStatus("idle");
                        setMessage("");
                      }}
                    >
                      Get started
                    </button>
                  </p>
                </form>
              </>
            ) : (
              <>
                <h1 className={styles.title}>Get started today</h1>
                <p className={styles.subtitle}>
                  {isHair ? (
                    <>
                      You&apos;re one step from your Personalized Hair Assessment. A full report on
                      what&apos;s driving your loss, your right plan, and vetted surgeons when needed,
                      plus 30 days of concierge access to help you decide.
                    </>
                  ) : (
                    <>
                      You&apos;re one step from your Personalized Aesthetic Assessment. A full report on
                      your goals, your candidacy, and the surgeons worth your time, plus 30 days of
                      concierge access to help you decide.
                    </>
                  )}
                </p>

                <form className={styles.form} onSubmit={handleSignup} noValidate>
                  <div className={styles.fields}>
                    <div className={styles.field}>
                      <label htmlFor="full-name" className={styles.label}>
                        Full name
                      </label>
                      <input
                        id="full-name"
                        name="fullName"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={status === "loading"}
                        className={styles.input}
                        placeholder="Sarah Mitchell"
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="signup-email" className={styles.label}>
                        Email address
                      </label>
                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === "loading"}
                        className={styles.input}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="phone" className={styles.label}>
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={status === "loading"}
                        className={styles.input}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>

                  </div>

                  <div className={styles.actions}>
                    <button type="submit" className={styles.continue} disabled={!canSubmitSignup}>
                      <span>{status === "loading" ? "Redirecting…" : "Continue"}</span>
                      <span className={styles.continueIcon} aria-hidden="true">
                        <img src={ARROW_RIGHT_ICON_SRC} alt="" />
                      </span>
                    </button>

                    <p className={styles.legal}>
                      By continuing you agree to our{" "}
                      <a
                        href="/terms"
                        className={styles.legalLink}
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className={styles.legalLink}
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>

                  <p className={styles.loginRow}>
                    <span>Already have an account?</span>{" "}
                    <button
                      type="button"
                      className={
                        isHair
                          ? `${styles.loginSwitch} ${styles.loginSwitchHair}`
                          : styles.loginSwitch
                      }
                      onClick={() => {
                        setMode("signin");
                        setView("form");
                        setStatus("idle");
                        setMessage("");
                      }}
                    >
                      Log in
                    </button>
                  </p>
                </form>
              </>
            )}

            {message ? (
              <p
                className={`${styles.message} ${
                  status === "success" ? styles.messageSuccess : styles.messageError
                }`}
                role={status === "success" ? "status" : "alert"}
              >
                {message}
              </p>
            ) : null}
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.bottomLinks}>
              <a
                href="/privacy"
                className={styles.bottomLink}
              >
                Privacy
              </a>
              <a href="/terms" className={styles.bottomLink}>
                Terms
              </a>
            </div>
            <div className={styles.copyright}>© 2026 AestheticMatch</div>
          </div>
        </div>
      </section>
    </main>
  );
}

