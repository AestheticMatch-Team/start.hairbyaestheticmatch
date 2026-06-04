/** Request bodies for proxied `/api/*` calls to aestheticmatchfinal. Context GET responses are typed in `api-client.ts`. */

export type PaywallCheckoutBody = {
  customer_id?: string | null;
  email: string;
  name?: string;
  phone?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  price_variant?: "149" | "79" | "129";
  utm_source?: string;
  utm_campaign?: string;
  cf_click_id?: string;
  affiliate_partner?: string;
  [key: string]: unknown;
};

export type PaywallCheckoutResponse = {
  clientSecret?: string;
  error?: string;
};

export type PaywallSignupBody = {
  email: string;
  name?: string;
  phone?: string;
  funnel: "hair";
  affiliate_partner?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  am_hair_price_variant?: "149" | "79";
  [key: string]: unknown;
};

import type { HairPreQuizAnswers } from "./hair-pre-quiz-answers";

export type SavePreQuizProgressBody = {
  customer_id: string;
  answers: HairPreQuizAnswers | Partial<HairPreQuizAnswers>;
};

export type SavePostQuizProgressBody = {
  customer_id: string;
  answers: Record<string, unknown>;
  last_step?: number;
  completed?: boolean;
};

export type MagicLinkBody = {
  email: string;
  funnel: "hair";
  redirectTo?: string;
};

export type ChargeOnFileBody = {
  customer_id: string;
  [key: string]: unknown;
};
