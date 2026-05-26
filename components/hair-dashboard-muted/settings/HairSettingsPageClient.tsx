"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HAIR_SETTINGS_AMOUNT_MASKED,
  HAIR_SETTINGS_CANCEL_MEMBERSHIP_MAILTO,
  HAIR_SETTINGS_PHOTO_SLOTS,
  HAIR_SETTINGS_TABS,
  parseHairSettingsTabParam,
  type HairSettingsTabId,
} from "./hair-settings-data";
import { HairSettingsCheckIcon, HairSettingsCloseIcon, HairSettingsEyeIcon } from "./HairSettingsIcons";
import styles from "./hair-settings.module.scss";

export type HairSettingsBillingHistoryRow = {
  id: string;
  created_at: string;
  amount_cents: number;
  status: string;
  payment_type: string;
  description?: string;
};

export type HairSettingsPageClientProps = {
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
  billingPaymentHistory: HairSettingsBillingHistoryRow[];
  billingCardLast4: string | null;
};

function paymentTypeLabel(paymentType: string): string {
  const t = paymentType.toLowerCase();
  if (t === "personalized_report" || t === "membership_signup") return "Personalized Report";
  if (t === "membership_recurring") return "Premium Membership";
  if (t === "dashboard_charge") return "Dashboard purchase";
  return paymentType.replace(/_/g, " ");
}

function formatUsdFromCents(cents: number): string {
  const n = Number.isFinite(cents) ? cents / 100 : 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatPaymentDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function paymentStatusLabel(status: string): string {
  const s = status.toLowerCase();
  if (s === "paid") return "Paid";
  if (s === "pending") return "Pending";
  if (s === "processing") return "Processing";
  if (s === "failed") return "Failed";
  if (s === "canceled" || s === "cancelled") return "Canceled";
  return status || "—";
}

function heroBadgeText(status: string | null): string {
  const s = (status || "").toLowerCase();
  if (s === "active") return "ACTIVE";
  if (s === "trialing") return "TRIAL";
  if (s === "past_due") return "PAST DUE";
  if (s === "canceled" || s === "cancelled") return "ENDED";
  if (s) return status!.slice(0, 12).toUpperCase();
  return "—";
}

function formatRenewalLong(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function HairSettingsPageClient({
  tabParam,
  initials,
  displayName,
  memberLine,
  initialFullName,
  initialPhone,
  initialEmail,
  initialLocation,
  billingSubscriptionStatus,
  billingCurrentPeriodEnd,
  billingMondayRenewalYmd,
  billingCancelAtPeriodEnd,
  billingPaymentStatus,
  billingPaymentHistory,
  billingCardLast4,
}: HairSettingsPageClientProps) {
  const [activeTab, setActiveTab] = useState<HairSettingsTabId>(() => parseHairSettingsTabParam(tabParam));

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [location, setLocation] = useState(initialLocation);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [revealedAmounts, setRevealedAmounts] = useState<Record<string, boolean>>({});

  const [uploadedPhotos, setUploadedPhotos] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    HAIR_SETTINGS_PHOTO_SLOTS.forEach((s) => {
      if (s.defaultUploaded) initial.add(s.id);
    });
    return initial;
  });

  const renewalLabel = useMemo(() => {
    const renewalIso =
      billingMondayRenewalYmd && /^\d{4}-\d{2}-\d{2}$/.test(billingMondayRenewalYmd)
        ? `${billingMondayRenewalYmd}T12:00:00.000Z`
        : billingCurrentPeriodEnd;
    const formatted = formatRenewalLong(renewalIso);
    if (!formatted) return "";
    return billingCancelAtPeriodEnd ? `Ends ${formatted}` : `Renews ${formatted}`;
  }, [billingMondayRenewalYmd, billingCurrentPeriodEnd, billingCancelAtPeriodEnd]);

  const subscriptionPillText = heroBadgeText(billingSubscriptionStatus);
  const subLower = (billingSubscriptionStatus || "").toLowerCase();
  const showPremiumHero =
    subLower === "active" ||
    subLower === "trialing" ||
    subLower === "past_due" ||
    subLower === "unpaid";
  const premiumHeadline = billingCancelAtPeriodEnd
    ? "Your membership is ending"
    : "You're a premium member";
  const cardLast4Display = billingCardLast4 ?? "••••";
  const showPaymentMethod = !!billingCardLast4 || billingPaymentStatus === "paid";

  const toggleAmountReveal = (rowId: string) => {
    setRevealedAmounts((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const handlePhotoSlotClick = (id: string) => {
    if (uploadedPhotos.has(id)) return;
    setUploadedPhotos((prev) => new Set(prev).add(id));
  };

  return (
    <div className={styles.page}>
      <Link href="/dashboard-muted" className={styles.closeX} aria-label="Close settings">
        <HairSettingsCloseIcon />
      </Link>

      <div className={styles.settingsShell}>
        <h1 className={styles.settingsTitle}>Settings</h1>

        <nav className={styles.tabs} role="tablist" aria-label="Settings sections">
          {HAIR_SETTINGS_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              className={`${styles.tab} ${activeTab === id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <section
          role="tabpanel"
          aria-hidden={activeTab !== "account"}
          className={`${styles.tabContent} ${activeTab === "account" ? styles.tabContentActive : ""}`}
        >
          <div className={styles.profileHeader}>
            <div className={styles.avatar} aria-hidden>
              {initials}
            </div>
            <div>
              <div className={styles.profileName}>{displayName}</div>
              <div className={styles.profileMeta}>{memberLine}</div>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="hair-settings-fullname">Full Name</label>
              <input
                id="hair-settings-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="hair-settings-phone">Phone Number</label>
              <input
                id="hair-settings-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor="hair-settings-email">Email Address</label>
              <input
                id="hair-settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor="hair-settings-location">Location</label>
              <input
                id="hair-settings-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                autoComplete="address-level2"
              />
            </div>
          </div>

          <div className={styles.privacyCard}>
            <h3>Privacy & Data</h3>
            <div className={styles.privacyRow}>
              <a href="#">Download My Data</a>
            </div>
            <div className={styles.privacyRow}>
              <button type="button">Log out</button>
              <button type="button" className={styles.danger}>
                Delete Account
              </button>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
              Save Changes
            </button>
            <button type="button" className={`${styles.btn} ${styles.btnOutline}`}>
              Cancel
            </button>
          </div>
        </section>

        <section
          role="tabpanel"
          aria-hidden={activeTab !== "password"}
          className={`${styles.tabContent} ${activeTab === "password" ? styles.tabContentActive : ""}`}
        >
          <div className={styles.fieldStack}>
            <div className={styles.field}>
              <label htmlFor="hair-settings-curpw">Current Password</label>
              <input
                id="hair-settings-curpw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="hair-settings-newpw">New Password</label>
              <input
                id="hair-settings-newpw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="hair-settings-confirmpw">Confirm New Password</label>
              <input
                id="hair-settings-confirmpw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className={styles.requirementsCard}>
            <h4>Password requirements</h4>
            <ul>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One number or symbol</li>
            </ul>
          </div>

          <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnPw}`}>
            Update Password
          </button>
        </section>

        <section
          role="tabpanel"
          aria-hidden={activeTab !== "billing"}
          className={`${styles.tabContent} ${activeTab === "billing" ? styles.tabContentActive : ""}`}
        >
          {showPremiumHero && (
            <div className={styles.premiumCard}>
              <div className={styles.premiumHeader}>
                <span className={styles.premiumLabel}>Premium Membership</span>
                <span className={styles.activePill}>{subscriptionPillText}</span>
              </div>
              <div className={styles.premiumBody}>
                <div>
                  <div className={styles.premiumHeadline}>{premiumHeadline}</div>
                  {renewalLabel && <div className={styles.premiumRenews}>{renewalLabel}</div>}
                </div>
                {!billingCancelAtPeriodEnd && (
                  <a
                    href={HAIR_SETTINGS_CANCEL_MEMBERSHIP_MAILTO}
                    className={styles.cancelBtn}
                  >
                    Cancel Membership
                  </a>
                )}
              </div>
            </div>
          )}

          {showPaymentMethod && (
            <>
              <h3 className={styles.sectionLabel}>Payment Method</h3>
              <div className={styles.paymentMethod}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardIcon} aria-hidden />
                  <span className={styles.cardDigits}>
                    • • • • &nbsp;• • • • &nbsp;• • • • &nbsp;{cardLast4Display}
                  </span>
                </div>
                <button type="button" className={styles.updateLink}>
                  Update
                </button>
              </div>
            </>
          )}

          <h3 className={styles.sectionLabel}>Billing History</h3>
          <div className={styles.billingHistoryCard}>
            <div className={`${styles.historyRow} ${styles.historyRowHead}`}>
              <span>Date</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {billingPaymentHistory.length === 0 ? (
              <div className={styles.historyRow}>
                <span className={styles.desc}>No payments yet.</span>
              </div>
            ) : (
              billingPaymentHistory.map((row) => {
                const revealed = !!revealedAmounts[row.id];
                return (
                  <div key={row.id} className={styles.historyRow}>
                    <span className={styles.date}>{formatPaymentDate(row.created_at)}</span>
                    <span className={styles.desc}>
                      {row.description?.trim() || paymentTypeLabel(row.payment_type)}
                    </span>
                    <div className={styles.amountCell}>
                      <span
                        className={`${styles.amountValue} ${!revealed ? styles.amountMasked : ""}`}
                      >
                        {revealed ? formatUsdFromCents(row.amount_cents) : HAIR_SETTINGS_AMOUNT_MASKED}
                      </span>
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        aria-label={revealed ? "Hide amount" : "Reveal amount"}
                        onClick={() => toggleAmountReveal(row.id)}
                      >
                        <HairSettingsEyeIcon />
                      </button>
                    </div>
                    <span className={styles.status}>
                      <span className={styles.statusPill}>{paymentStatusLabel(row.status)}</span>
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className={styles.revealNote}>
            <strong>Default state:</strong> amounts masked as • • • • • with an eye icon affordance.{" "}
            <strong>Tap to reveal</strong> that row&apos;s amount inline. Tap again to re-mask. No $
            value shown without explicit user action.
          </div>
        </section>

        <section
          role="tabpanel"
          aria-hidden={activeTab !== "photos"}
          className={`${styles.tabContent} ${activeTab === "photos" ? styles.tabContentActive : ""}`}
        >
          <div className={styles.photosGrid}>
            {HAIR_SETTINGS_PHOTO_SLOTS.map((slot) => {
              const uploaded = uploadedPhotos.has(slot.id);
              return (
                <button
                  key={slot.id}
                  type="button"
                  className={`${styles.photoSlot} ${uploaded ? styles.photoUploaded : ""}`}
                  onClick={() => handlePhotoSlotClick(slot.id)}
                >
                  <div className={styles.photoHead}>
                    <div>
                      <div className={styles.photoTitle}>{slot.title}</div>
                      <div className={styles.photoDesc}>{slot.description}</div>
                    </div>
                    <div className={styles.photoIndicator} aria-hidden>
                      {uploaded ? <HairSettingsCheckIcon /> : "+"}
                    </div>
                  </div>
                  <div className={styles.photoAction}>{uploaded ? "Re-upload" : "Tap to add photo"}</div>
                </button>
              );
            })}
          </div>

          <div className={styles.tipsCard}>
            <h4>Tips for best results</h4>
            <ul>
              <li>Use natural lighting — avoid harsh flash or backlighting</li>
              <li>Remove glasses and pull hair back from your face</li>
              <li>Keep a neutral expression and look directly at the camera</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
