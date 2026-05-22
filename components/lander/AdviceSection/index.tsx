import styles from './AdviceSection.module.scss'

const stats = [
  { value: '60+', label: 'vetted surgeons in our network' },
  { value: '900', label: 'cases informing our outcome database' },
  { value: '72-hour', label: 'turnaround' },
  { value: '$0', label: 'in referral fees taken' },
]

export default function AdviceSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Behind Every Assessment</p>
          <h2 className={styles.headline}>
            A specialist reads your case.{' '}
            <em className={styles.headlineItalic}>
              A network informs the recommendation.
            </em>
          </h2>
        </div>

        <div className={styles.cardsWrap}>
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Your Specialist</h3>
                <p className={styles.cardDesc}>
                  Every case is reviewed by a hair restoration specialist with clinical training in trichology, dermatology, or hair restoration medicine. Not an algorithm. Not a model. A person who has read thousands of cases and knows what they&apos;re looking at.
                </p>
              </div>
              <div className={styles.cardDivider} />
              <div className={styles.specialist}>
                <div className={styles.avatar}>
                  <img src="/hair-lander/specialist-avatar.jpg" alt="Specialist" className={styles.avatarImg} />
                </div>
                <div className={styles.specialistInfo}>
                  <p className={styles.specialistName}>Dr. Marcus Hale</p>
                  <p className={styles.specialistCred}>MD, ABHRS — Internationally Recognized Hair Restoration Surgeon</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>The Surgeon Network</h3>
                <p className={styles.cardDesc}>
                  When a procedural recommendation enters the picture, your case is cross-referenced against our independent surgeon network — vetted on technique, outcome data, case volume, and specialty fit. You see the surgeons right for your case. Not the ones paying for placement.
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>The Outcome Database</h3>
                <p className={styles.cardDesc}>
                  Your projection isn&apos;t generated. It&apos;s calibrated against thousands of documented outcomes across hair types, ethnicities, Norwood stages, and treatment combinations. What worked for men with your profile is what informs your forecast.
                </p>
              </div>
            </div>
          </div>

          <p className={styles.cardsNote}>
            Clinical training. Vetted network. Real outcomes. That&apos;s what&apos;s actually behind your report.
          </p>
        </div>

        <div className={styles.statsWrap}>
          <div className={styles.statsPanel}>
            <div className={styles.stats}>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <p className={styles.statValue}>{stats[0].value}</p>
                  <p className={styles.statLabel}>{stats[0].label}</p>
                </div>
                <div className={styles.statVDivider} />
                <div className={styles.stat}>
                  <p className={styles.statValue}>{stats[1].value}</p>
                  <p className={styles.statLabel}>{stats[1].label}</p>
                </div>
              </div>
              <div className={styles.statHDivider} />
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <p className={styles.statValue}>{stats[2].value}</p>
                  <p className={styles.statLabel}>{stats[2].label}</p>
                </div>
                <div className={styles.statVDivider} />
                <div className={styles.stat}>
                  <p className={styles.statValue}>{stats[3].value}</p>
                  <p className={styles.statLabel}>{stats[3].label}</p>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.statsNote}>
            Numbers to be filled in. The fourth one stays as written — it&apos;s the moral claim, and it lands hardest in the last position.
          </p>
        </div>
      </div>
    </section>
  )
}
