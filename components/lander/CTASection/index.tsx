import styles from './CTASection.module.scss'

type CTASectionProps = {
  isTurkey?: boolean
}

export default function CTASection({ isTurkey = false }: CTASectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h2 className={styles.headline}>We don&apos;t stop until something works.</h2>
          <p className={styles.subhead}>
            {isTurkey ? (
              <>
                If the first plan doesn&apos;t get you results, we re-diagnose in the app and your
                concierge adjusts. New protocol, new path, new approach — tracked in the app,
                executed for you. We keep going until your hair is solved.
              </>
            ) : (
              <>
                If the first plan doesn&apos;t get you results, your concierge adjusts it. New
                protocol, new path, new approach. We keep going until your hair is solved.
              </>
            )}
          </p>
        </div>
        <div className={styles.footer}>
          <p className={styles.footerTitle}>That&apos;s the deal.</p>
          <p className={styles.footerSub}>Not a refund policy. A commitment.</p>
        </div>
      </div>
    </section>
  )
}
