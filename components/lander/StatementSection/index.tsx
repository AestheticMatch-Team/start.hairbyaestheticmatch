import Image from 'next/image'
import styles from './StatementSection.module.scss'

const ECOSYSTEM_IMAGE = '/hair-lander/statement-treatment-ecosystem.png'

type StatementSectionProps = {
  isTurkey?: boolean
}

export default function StatementSection({ isTurkey = false }: StatementSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>What We Actually Do</p>
        <div className={styles.content}>
          <div className={styles.imageWrap}>
            <Image
              src={ECOSYSTEM_IMAGE}
              alt="Treatment ecosystem — oral therapy, low-level light therapy, and surgical planning"
              fill
              sizes="(max-width: 768px) 100vw, 1070px"
              className={styles.image}
            />
          </div>
          <p className={styles.headline}>
            {isTurkey ? (
              <>
                Most Hair Apps Push One Product. Ours Doesn&apos;t.{' '}
                <em className={styles.headlineItalic} style={{ color: '#8ea5c4' }}>
                  It Diagnoses Your Hair And Routes You To The Right Path — Oral, Topical, Supplement,
                  Or Surgical — Without Bias.
                </em>
              </>
            ) : (
              <>
                Every clinic, brand, and pharmacy sells one thing. We don&apos;t.{' '}
                <em className={styles.headlineItalic}>
                  A clinical report finds what works for you. A concierge executes it.
                </em>
              </>
            )}
          </p>
          <p className={styles.subhead}>Your hair, solved. No more trial and error.</p>
        </div>
      </div>
    </section>
  )
}
