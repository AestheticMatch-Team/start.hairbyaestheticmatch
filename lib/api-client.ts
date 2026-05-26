/**
 * Hair funnel HTTP client. Uses same-origin `/api/*`; next.config rewrites to
 * HAIR_BACKEND_ORIGIN (aestheticmatchfinal). No Supabase admin, Stripe secret, or Monday keys.
 */

import type {
  ChargeOnFileBody,
  MagicLinkBody,
  PaywallCheckoutBody,
  PaywallCheckoutResponse,
  PaywallSignupBody,
  SavePostQuizProgressBody,
  SavePreQuizProgressBody,
} from "./api-types";

export class HairApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "HairApiError";
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof (data as { error?: string }).error === "string"
        ? (data as { error: string }).error
        : res.statusText || "Request failed";
    throw new HairApiError(msg, res.status, data);
  }
  return data as T;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    credentials: "include",
  });
  return parseJson<T>(res);
}

export type PaywallSignupRequest = {
  name: string;
  email: string;
  phone: string;
  funnel: Record<string, string | undefined>;
};

export function paywallSignup(body: PaywallSignupRequest) {
  return apiFetch<{
    customer_id?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    action_link?: string | null;
    error?: string;
    code?: string;
  }>("/api/paywall-signup", { method: "POST", body: JSON.stringify(body) });
}

export function customerExists(email: string) {
  return apiFetch<{ exists?: boolean }>("/api/auth/customer-exists", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function sendHairMagicLink(body: MagicLinkBody) {
  return apiFetch<{ ok?: boolean }>("/api/auth/magic-link", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function createPaywallCheckout(body: PaywallCheckoutBody) {
  return apiFetch<PaywallCheckoutResponse>("/api/v4/paywall-checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function savePreQuizProgress(body: SavePreQuizProgressBody) {
  return apiFetch<{ ok?: boolean }>("/api/hair/save-pre-quiz-progress", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function savePostQuizProgress(body: SavePostQuizProgressBody) {
  return apiFetch<{ ok?: boolean }>("/api/hair/save-post-quiz-progress", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type PostCheckoutContextResponse = {
  customerId: string;
  scheduleToken: string;
  browserPurchase?: { transaction_id: string };
  purchaseContact?: { email?: string; phone?: string; name?: string };
  redirect?: string;
  error?: string;
};

export function fetchPostCheckoutContext() {
  return apiFetch<PostCheckoutContextResponse>("/api/hair/post-checkout-context", {
    method: "GET",
  });
}

export type PostQuizContextResponse = {
  customerId: string;
  email: string;
  name: string;
  phone: string;
  savedAnswers: Record<string, unknown>;
  hairPq: Record<string, unknown>;
  initialStep: number;
  identityPill: string;
  error?: string;
};

export function fetchPostQuizContext() {
  return apiFetch<PostQuizContextResponse>("/api/hair/post-quiz-context", {
    method: "GET",
  });
}

export type ImageUploadContextResponse = {
  mondayItemId?: string;
  uploadToken?: string;
  initialUploadedAngles?: Record<string, boolean>;
  error?: string;
};

export function fetchImageUploadContext(query?: string) {
  const qs = query?.startsWith("?") ? query : query ? `?${query}` : "";
  return apiFetch<ImageUploadContextResponse>(`/api/hair/image-upload-context${qs}`, {
    method: "GET",
  });
}

export type DashboardMutedContextResponse = {
  customerId: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerName: string | null;
  customerCity: string | null;
  customerRegion: string | null;
  customerPostcode: string | null;
  expeditedDeliveryPurchased: boolean;
  error?: string;
};

export function fetchDashboardMutedContext() {
  return apiFetch<DashboardMutedContextResponse>("/api/hair/dashboard-muted-context", {
    method: "GET",
  });
}

export type DashboardSettingsContextResponse = {
  tabParam?: string;
  initials: string;
  displayName: string;
  memberLine: string;
  initialFullName: string;
  initialPhone: string;
  initialEmail: string;
  initialLocation: string;
  billingSubscriptionStatus: string | null;
  billingCurrentPeriodEnd: string | null;
  billingMondayRenewalYmd: string | null;
  billingCancelAtPeriodEnd: boolean;
  billingCanOpenStripePortal: boolean;
  billingPaymentStatus: string | null;
  billingPaymentHistory: {
    id: string;
    created_at: string;
    amount_cents: number;
    status: string;
    payment_type: string;
    description?: string;
  }[];
  billingCardLast4: string | null;
  error?: string;
};

export function fetchDashboardSettingsContext(query?: string) {
  const qs = query?.startsWith("?") ? query : query ? `?${query}` : "";
  return apiFetch<DashboardSettingsContextResponse>(
    `/api/hair/dashboard-settings-context${qs}`,
    { method: "GET" },
  );
}

export function scheduleQuizNotStartedEmails(body: Record<string, unknown>) {
  return apiFetch<unknown>("/api/post-checkout/schedule-quiz-not-started-emails", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function cancelQuizNotStartedEmails(body: Record<string, unknown>) {
  return apiFetch<unknown>("/api/post-checkout/cancel-quiz-not-started-emails", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function photoUploadIdle(body: Record<string, unknown>) {
  return apiFetch<unknown>("/api/lifecycle/photo-upload/idle", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function photoUploadExit(body: Record<string, unknown>) {
  return apiFetch<unknown>("/api/lifecycle/photo-upload/exit", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getAnglePhotos(params: URLSearchParams) {
  return apiFetch<unknown>(`/api/monday/angle-photos?${params.toString()}`);
}

export async function uploadAnglePhoto(formData: FormData) {
  const res = await fetch("/api/monday/upload-angle-photo", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  return parseJson<unknown>(res);
}

export function photoUploadReviewComplete(body: Record<string, unknown>) {
  return apiFetch<unknown>("/api/quiz/photo-upload-review-complete", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function chargeOnFile(body: ChargeOnFileBody) {
  return apiFetch<unknown>("/api/payments/charge-on-file", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function trackFunnelEvent(body: Record<string, unknown>) {
  return apiFetch<unknown>("/api/funnel-event", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type GetStartedContextResponse = {
  authenticated: boolean;
  email?: string;
  redirect?: string;
  error?: string;
};

export function fetchGetStartedContext(query?: string) {
  const qs = query?.startsWith("?") ? query : query ? `?${query}` : "";
  return apiFetch<GetStartedContextResponse>(`/api/hair/get-started-context${qs}`, {
    method: "GET",
  });
}

export type PreQuizContextResponse = {
  savedAnswers: Partial<Record<string, unknown>> | null;
  resolvedPriceVariant: 149 | 79;
  error?: string;
};

export function fetchPreQuizContext(customerId: string, extraQuery?: string) {
  const base = `customer_id=${encodeURIComponent(customerId)}`;
  const extra = extraQuery?.replace(/^\?/, "") ?? "";
  const qs = extra ? `?${base}&${extra}` : `?${base}`;
  return apiFetch<PreQuizContextResponse>(`/api/hair/pre-quiz-context${qs}`, {
    method: "GET",
  });
}
