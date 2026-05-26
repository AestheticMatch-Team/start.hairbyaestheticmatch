type MaybeString = string | null | undefined;

export type MetaUserDataShape<TValue> = {
  em?: TValue;
  ph?: TValue;
  fn?: TValue;
  ln?: TValue;
  ct?: TValue;
  st?: TValue;
  zp?: TValue;
  db?: TValue;
  external_id?: TValue;
  fb_login_id?: TValue;
  fbc?: TValue;
  fbp?: TValue;
  ttclid?: TValue;
  ttp?: TValue;
  rdt_cid?: TValue;
  rdt_uuid?: TValue;
  client_ip_address?: TValue;
  client_user_agent?: TValue;
};

export type MetaUserDataInput = MetaUserDataShape<MaybeString>;
export type MetaUserData = MetaUserDataShape<string>;

export function splitFullNameToMetaFields(fullName: MaybeString): { fn?: string; ln?: string } {
  if (!fullName) return {};
  const normalized = compactSpaces(fullName);
  if (!normalized) return {};
  const parts = normalized.split(" ");
  const fn = parts[0] || undefined;
  const ln = parts.slice(1).join(" ") || undefined;
  return { fn, ln };
}

function compactSpaces(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeEmail(value: MaybeString): string | null {
  if (!value) return null;
  const out = compactSpaces(value).toLowerCase();
  return out || null;
}

function normalizePhone(value: MaybeString): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits || null;
}

function normalizeText(value: MaybeString): string | null {
  if (!value) return null;
  const out = compactSpaces(value).toLowerCase();
  return out || null;
}

function normalizePostcode(value: MaybeString): string | null {
  if (!value) return null;
  const out = compactSpaces(value).toLowerCase().replace(/\s+/g, "");
  return out || null;
}

function normalizeDateOfBirth(value: MaybeString): string | null {
  if (!value) return null;
  const digits = compactSpaces(value).replace(/\D/g, "");
  if (!/^\d{8}$/.test(digits)) return null;
  if (!/^(19|20)\d{6}$/.test(digits)) return null;
  return digits;
}

function normalizeRawId(value: MaybeString): string | null {
  if (!value) return null;
  const out = compactSpaces(value);
  return out || null;
}

function isSha256Hex(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

async function sha256Hex(value: string): Promise<string> {
  if (isSha256Hex(value)) return value.toLowerCase();
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Web Crypto subtle API is unavailable for hashing");
  }
  const data = new TextEncoder().encode(value);
  const digest = await subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function buildMetaEventUserData(input: MetaUserDataInput): Promise<MetaUserData> {
  const out: MetaUserData = {};

  const em = normalizeEmail(input.em);
  if (em) out.em = await sha256Hex(em);

  const ph = normalizePhone(input.ph);
  if (ph) out.ph = await sha256Hex(ph);

  const fn = normalizeText(input.fn);
  if (fn) out.fn = await sha256Hex(fn);

  const ln = normalizeText(input.ln);
  if (ln) out.ln = await sha256Hex(ln);

  const ct = normalizeText(input.ct);
  if (ct) out.ct = await sha256Hex(ct);

  const st = normalizeText(input.st);
  if (st) out.st = await sha256Hex(st);

  const zp = normalizePostcode(input.zp);
  if (zp) out.zp = await sha256Hex(zp);

  const db = normalizeDateOfBirth(input.db);
  if (db) out.db = await sha256Hex(db);

  const externalId = normalizeRawId(input.external_id);
  if (externalId) out.external_id = externalId;

  const fbLoginId = normalizeRawId(input.fb_login_id);
  if (fbLoginId) out.fb_login_id = fbLoginId;

  const fbc = normalizeRawId(input.fbc);
  if (fbc) out.fbc = fbc;

  const fbp = normalizeRawId(input.fbp);
  if (fbp) out.fbp = fbp;

  const ttclid = normalizeRawId(input.ttclid);
  if (ttclid) out.ttclid = ttclid;

  const ttp = normalizeRawId(input.ttp);
  if (ttp) out.ttp = ttp;

  const rdtCid = normalizeRawId(input.rdt_cid);
  if (rdtCid) out.rdt_cid = rdtCid;

  const rdtUuid = normalizeRawId(input.rdt_uuid);
  if (rdtUuid) out.rdt_uuid = rdtUuid;

  const clientIp = normalizeRawId(input.client_ip_address);
  if (clientIp) out.client_ip_address = clientIp;

  const clientUa = normalizeRawId(input.client_user_agent);
  if (clientUa) out.client_user_agent = clientUa;

  return out;
}
