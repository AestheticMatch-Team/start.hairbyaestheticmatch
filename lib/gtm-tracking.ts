import { buildMetaEventUserData, type MetaUserDataInput } from "@/lib/meta-event-user-data";
import { getClientNetworkContext } from "@/lib/client-network-context";
import { getMetaClickIds } from "@/lib/meta-tracking";
import { getTikTokClickIds } from "@/lib/tiktok-tracking";
import { getRedditClickIds } from "@/lib/reddit-tracking";

/** Initialize `window.dataLayer` before GTM loads so pushes are queued and not dropped. */
export const ensureDataLayer = (): void => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
};

interface PushOptions {
  debounceMs?: number;
  dedupeKey?: string;
  useIdleCallback?: boolean;
}

const STICKY_KEYS_TO_RESET: Record<string, null> = {
  value: null,
  currency: null,
  contents: null,
  items: null,
  ecommerce: null,
  item_id: null,
  item_name: null,
  item_price: null,
  item_quantity: null,
  order_id: null,
  transaction_id: null,
  event_id: null,
  quiz_name: null,
  step_key: null,
  step_index: null,
  step: null,
  option: null,
  event_time: null,
};

export function getEventTimeSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export const pushToDataLayer = (
  payload: Record<string, unknown>,
  options: PushOptions = {},
): void => {
  const { debounceMs = 0, dedupeKey, useIdleCallback = true } = options;

  if (typeof window === "undefined") return;

  ensureDataLayer();

  if (dedupeKey) {
    const lastPushTime = localStorage.getItem(`gtm_${dedupeKey}_timestamp`);
    const lastPayload = localStorage.getItem(`gtm_${dedupeKey}_payload`);

    if (lastPushTime && lastPayload) {
      const timeSinceLastPush = Date.now() - parseInt(lastPushTime, 10);

      if (timeSinceLastPush < debounceMs && JSON.stringify(payload) === lastPayload) {
        console.log(`[GTM] Skipping duplicate event: ${dedupeKey}`);
        return;
      }
    }

    localStorage.setItem(`gtm_${dedupeKey}_timestamp`, Date.now().toString());
    localStorage.setItem(`gtm_${dedupeKey}_payload`, JSON.stringify(payload));
  }

  const payloadWithSource =
    payload.event && typeof window.location?.href === "string"
      ? { event_source_url: window.location.href, ...payload }
      : payload;

  const push = () => {
    if (window.dataLayer) {
      if (payload.event) {
        window.dataLayer.push({ ...STICKY_KEYS_TO_RESET });
      }
      const toPush =
        payload.event != null
          ? {
              event_time: getEventTimeSeconds(),
              ...payloadWithSource,
            }
          : payloadWithSource;
      window.dataLayer.push(toPush);
      console.log("[GTM] Event pushed to dataLayer:", toPush.event, toPush);
    }
  };

  if (useIdleCallback && window.requestIdleCallback) {
    window.requestIdleCallback(push, { timeout: 1000 });
  } else {
    setTimeout(push, 0);
  }
};

export interface PurchaseEventData {
  transaction_id: string;
  value?: number;
  currency?: string;
  user_data?: MetaUserDataInput;
  eventName?: string;
}

export const PURCHASE_TRACKING_VALUE_USD = 100;

async function compactUserData(
  ud?: PurchaseEventData["user_data"],
): Promise<Record<string, string> | undefined> {
  if (!ud) return undefined;
  const out = await buildMetaEventUserData(ud);
  return Object.keys(out).length ? out : undefined;
}

export const trackPurchase = (data: PurchaseEventData): void => {
  void (async () => {
    const {
      transaction_id,
      currency = "USD",
      user_data: userDataIn,
      eventName = "purchase",
    } = data;
    const value = PURCHASE_TRACKING_VALUE_USD;
    const user_data = await compactUserData(userDataIn);

    const payload = {
      event: eventName,
      event_id: transaction_id,
      transaction_id,
      value,
      currency,
      ...(user_data && { user_data }),
    };

    pushToDataLayer(payload, {
      dedupeKey: `${eventName}_${transaction_id}`,
      debounceMs: 5000,
      useIdleCallback: false,
    });
  })().catch((error) => {
    console.error("[GTM] Failed to build purchase user_data:", error);
  });
};

export const trackGetStartedCtaClick = (eventName: string = "get_started_cta_click"): void => {
  const { fbc, fbp } = getMetaClickIds();
  const { ttclid, ttp } = getTikTokClickIds();
  const { rdt_cid, rdt_uuid } = getRedditClickIds();
  const user_data: Record<string, string> = {};
  if (fbc) user_data.fbc = fbc;
  if (fbp) user_data.fbp = fbp;
  if (ttclid) user_data.ttclid = ttclid;
  if (ttp) user_data.ttp = ttp;
  if (rdt_cid) user_data.rdt_cid = rdt_cid;
  if (rdt_uuid) user_data.rdt_uuid = rdt_uuid;
  const { client_ip_address, client_user_agent } = getClientNetworkContext();
  if (client_ip_address) user_data.client_ip_address = client_ip_address;
  if (client_user_agent) user_data.client_user_agent = client_user_agent;

  pushToDataLayer(
    {
      event: eventName,
      ...(Object.keys(user_data).length > 0 ? { user_data } : {}),
    },
    { useIdleCallback: false },
  );
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
