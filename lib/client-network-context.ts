const CLIENT_IP_KEY = "am_client_ip";
const CLIENT_UA_KEY = "am_client_ua";

export type ClientNetworkContext = {
  client_ip_address?: string;
  client_user_agent?: string;
};

export function persistClientNetworkContext(ip?: string | null, userAgent?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (ip?.trim()) sessionStorage.setItem(CLIENT_IP_KEY, ip.trim());
    if (userAgent?.trim()) sessionStorage.setItem(CLIENT_UA_KEY, userAgent.trim());
  } catch {}
}

export function getClientNetworkContext(): ClientNetworkContext {
  if (typeof window === "undefined") return {};
  let ip: string | undefined;
  let ua: string | undefined;
  try {
    ip = sessionStorage.getItem(CLIENT_IP_KEY)?.trim() || undefined;
    ua = sessionStorage.getItem(CLIENT_UA_KEY)?.trim() || undefined;
  } catch {}
  if (!ua && typeof navigator !== "undefined") {
    ua = navigator.userAgent?.trim() || undefined;
  }
  return {
    ...(ip ? { client_ip_address: ip } : {}),
    ...(ua ? { client_user_agent: ua } : {}),
  };
}

export function withClientNetworkContext<T extends Record<string, unknown>>(input: T): T {
  return { ...input, ...getClientNetworkContext() };
}
