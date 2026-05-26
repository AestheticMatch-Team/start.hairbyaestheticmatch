type TrackOpsEventInput = {
  eventType: string;
  customerId?: string | null;
  email?: string | null;
  metadata?: Record<string, unknown> | null;
};

type TrackOpsEventOptions = {
  keepalive?: boolean;
};

/** Mirrors main app `trackOpsEvent` — POSTs proxied `/api/funnel-event`. */
export async function trackOpsEvent(
  input: TrackOpsEventInput,
  options: TrackOpsEventOptions = {},
): Promise<void> {
  const eventType = input.eventType?.trim();
  const customerId = input.customerId?.trim();
  if (!eventType || !customerId) return;

  await fetch("/api/funnel-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: eventType,
      customer_id: customerId,
      email: input.email?.trim().toLowerCase() || undefined,
      metadata: input.metadata ?? {},
    }),
    keepalive: options.keepalive ?? true,
    credentials: "include",
  }).catch(() => {});
}
