import Link from "next/link";
import styles from "@/components/get-started/get-started.module.scss";

/** Brief fallback before searchParams resolve — no full two-column layout. */
export function HairGetStartedNeutralLoading() {
  return <HairGetStartedFullLoading />;
}

export function HairGetStartedMinimalLoading() {
  return <HairGetStartedFullLoading />;
}

export function HairGetStartedFullLoading() {
  return (
    <main className={styles.page} aria-busy="true" aria-live="polite">
      <section className={`${styles.left} ${styles.leftHair}`} aria-hidden="true">
        <div className={styles.brand}>
          <Link
            href="/"
            className={`${styles.brandLink} ${styles.brandLinkHair}`}
            aria-label="AestheticMatch Hair home"
          >
            <img src="/hair/hair_logo.png" alt="" width={40} height={40} />
            AestheticMatch Hair
          </Link>
        </div>
        <div className={styles.leftContent}>
          <h2 className={styles.leftTitle}>
            Find what works.
            <br />
            See your results.
          </h2>
          <p className={styles.leftSubtitle}>
            An independent analysis of your hair loss and what actually works — before you spend a
            dollar.
          </p>
        </div>
      </section>
      <section className={styles.right} aria-label="Loading account">
        <div className={styles.rightInner}>
          <div className={styles.formWrap}>
            <div className={styles.loadingState}>
              <span className={styles.loadingSpinner} aria-hidden="true" />
              <h1 className={styles.title}>One moment</h1>
              <p className={styles.subtitle}>We&apos;re preparing your experience.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
