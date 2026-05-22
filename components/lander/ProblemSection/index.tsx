import styles from './ProblemSection.module.scss'

export default function ProblemSection() {
  return (
    <section id="problem" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Why This Exists</p>
          <h2 className={styles.headline}>
            Every option you&apos;ve researched{' '}
            <em className={styles.headlineItalic}>
              is being{' '}
              sold to you by someone who profits from it.
            </em>
          </h2>
          <div className={styles.body}>
            <p className={styles.bodyText}>
              Clinics sell transplants. Telehealth brands sell the same three medications. Supplement companies sell hope. Forums sell anxiety. Every man in hair loss ends up running his own trial-and-error experiment — a year of finasteride that didn&apos;t work, a stack of supplements that didn&apos;t move the needle, a clinic consult that pushed the procedure they happened to do.
            </p>
            <p className={styles.bodyText}>
              Nobody sits down with your case and identifies what actually works for you, because nobody else makes money when the answer isn&apos;t the one thing they sell.
            </p>
          </div>
        </div>

        <div className={styles.imagesGroup}>
          <p className={styles.imagesLabel}>From the men we worked with</p>
          <div className={styles.images}>
          <div className={styles.imgCard}>
            <img src="/hair-lander/why-exists-1.png" alt="" className={styles.img} />
          </div>
          <div className={styles.imgCard}>
            <img src="/hair-lander/why-exists-2.png" alt="" className={styles.img} />
          </div>
          <div className={styles.imgCard}>
            <img src="/hair-lander/why-exists-3.png" alt="" className={styles.img} />
          </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerTitle}>One report. One concierge. The right path. Executed.</p>
          <p className={styles.footerSub}>Your hair, solved. No more trial and error.</p>
        </div>
      </div>
    </section>
  )
}
