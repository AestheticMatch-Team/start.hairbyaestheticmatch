import Link from "next/link";
import styles from "./PricingSection.module.scss";

const features = [
  "Full clinical hair assessment",
  "Diagnosis, progression forecast, and visualization",
  "Candidacy across every treatment we evaluate",
  "The specific path that works for your case",
  "Concierge specialist meeting + first month of execution",
];

export default function PricingSection() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Pricing</p>
          <h2 className={styles.headline}>
            One price.{" "}
            <em className={styles.headlineItalic}>No upsell ladder.</em>
          </h2>
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <p className={styles.cardLabel}>The Assessment</p>
              <p className={styles.cardPrice}>
                $199 <span className={styles.cardPriceSub}>one-time</span>
              </p>
              <div className={styles.divider} />
            </div>
            <div className={styles.features}>
              {features.map((f) => (
                <div key={f} className={styles.feature}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="24"
                      height="24"
                      rx="12"
                      fill="white"
                      fillOpacity="0.12"
                    />
                    <path
                      d="M8 12L10.6668 15L16 9"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className={styles.featureLabel}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/quiz" className={styles.cta}>
              Start My Assessment
            </Link>
          </div>
          <div className={styles.noteWrap}>
            <p className={styles.noteLead}>
              The only $199 in hair loss that isn&apos;t trying to sell you
              something. Your hair, solved. No more trial and error.
            </p>
            <p className={styles.cardNote}>
              Continued concierge support: $99/month after month one. Cancel
              anytime. No contracts.
            </p>
          </div>
        </div>

        <div className={styles.baRow}>
          {["B/A", "B/A", "B/A"].map((label, i) => (
            <div key={i} className={styles.baTile}>
              <span className={styles.baBadge}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
