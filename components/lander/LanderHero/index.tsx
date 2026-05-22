import styles from "./LanderHero.module.scss";
import ComparisonSlider from "./ComparisonSlider";
import HairGetStartedLink from "@/components/lander/HairGetStartedLink";

const SLIDER_1_BEFORE = "/hair-lander/hero-comparison-1-before.png";
const SLIDER_1_AFTER = "/hair-lander/hero-comparison-1-after.png";
const SLIDER_2_BEFORE = "/hair-lander/hero-comparison-2-before.png";
const SLIDER_2_AFTER = "/hair-lander/hero-comparison-2-after.png";

export default function LanderHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.topText}>
            <p className={styles.eyebrow}>
              Clinical Hair Assessment · Concierge Execution
            </p>
            <div className={styles.headlineWrap}>
              <h1 className={styles.headline}>
                Your Hair, Solved.
                <span className={styles.headlineAccent}>No More Trial and Error.</span>
              </h1>
              <p className={styles.subhead}>
                A clinical report diagnoses what&apos;s actually happening. Your concierge executes
                the plan that works for your case — meds, protocols, procedures, or any combination.
                End-to-end.
              </p>
              <p className={styles.quote}>
                Every other platform sells one treatment. We diagnose first, then execute the right one.
              </p>
            </div>
          </div>
          <div className={styles.ctaGroup}>
            <HairGetStartedLink className={styles.cta}>
              Start My Assessment
            </HairGetStartedLink>
            <p className={styles.disclaimer}>
              Board-certified review · No referral fees, ever
            </p>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.comparisons}>
          <ComparisonSlider
            beforeSrc={SLIDER_1_BEFORE}
            afterSrc={SLIDER_1_AFTER}
            beforeAlt="Before hair treatment — patient 1"
            afterAlt="After hair treatment — patient 1"
            priority
          />
          <ComparisonSlider
            beforeSrc={SLIDER_2_BEFORE}
            afterSrc={SLIDER_2_AFTER}
            beforeAlt="Before hair treatment — patient 2"
            afterAlt="After hair treatment — patient 2"
          />
        </div>
      </div>
    </section>
  );
}
