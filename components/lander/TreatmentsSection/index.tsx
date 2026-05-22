import styles from './TreatmentsSection.module.scss'

const categories = [
  {
    label: 'Foundation',
    cards: [
      {
        img: '/hair-lander/treatment-oral.png',
        title: 'Oral medications',
        desc: 'Finasteride, dutasteride, oral minoxidil. Dosing, candidacy, side-effect profile, and labs reviewed.',
      },
      {
        img: '/hair-lander/treatment-topical.png',
        title: 'Topicals',
        desc: 'Topical minoxidil formulations, ketoconazole, compounded multi-actives. Matched to your scalp profile.',
      },
      {
        img: '/hair-lander/treatment-supplements.png',
        title: 'Supplements',
        desc: 'Evidence-graded. We tell you which ones have data behind them and which ones are marketing.',
      },
    ],
  },
  {
    label: 'Escalation',
    cards: [
      {
        img: '/hair-lander/treatment-prp.png',
        title: 'PRP / Exosomes',
        desc: 'Candidacy, expected response, and protocol cadence based on your stage.',
      },
      {
        img: '/hair-lander/treatment-lllt.png',
        title: 'Low-level laser therapy',
        desc: "Whether it's worth your time and money for your specific case.",
      },
      {
        img: '/hair-lander/treatment-compounded.png',
        title: 'Compounded protocols',
        desc: "Custom formulations through licensed pharmacies when off-the-shelf isn't enough.",
      },
    ],
  },
  {
    label: 'Procedural',
    cards: [
      {
        img: '/hair-lander/treatment-fue.png',
        title: 'Hair transplant (FUE / DHI)',
        desc: 'Candidacy assessment, realistic graft count, donor capacity, technique match, and surgeon coordination.',
      },
      {
        img: '/hair-lander/treatment-smp.png',
        title: 'Scalp micropigmentation',
        desc: "When it's the right call, when it's the wrong call, and who actually does it well.",
      },
      {
        img: '/hair-lander/treatment-fut.png',
        title: 'Hair transplant (FUT)',
        desc: "Still the right call for some cases; high graft counts, advanced loss, donor density FUE can't deliver. We'll tell you when it's worth the linear scar.",
      },
    ],
  },
]

const executionItems = [
  'Gets you the prescription through a licensed prescribing provider in your state',
  'Sources the protocol or compounded formulation',
  'Coordinates the surgical consult and vets the surgeon for your specific case',
  'Preps you for the procedure and manages the timeline',
  "Tracks your progress and adjusts the protocol when something isn't working",
]

export default function TreatmentsSection() {
  return (
    <section id="treatments" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Every Path On The Table</p>
          <h2 className={styles.headline}>
            We don&apos;t sell any of these.{' '}
            <em className={styles.headlineItalic}>
              We find the right one for your case — and execute it.
            </em>
          </h2>
          <p className={styles.subhead}>
            Most platforms sell you one treatment. We assess your candidacy across the full clinical menu, identify the path that fits your case, and your concierge coordinates execution end-to-end.
          </p>
        </div>

        <div className={styles.categories}>
          {categories.map((cat) => (
            <div key={cat.label} className={styles.category}>
              <div className={styles.categoryHeader}>
                <p className={styles.categoryLabel}>{cat.label}</p>
                <div className={styles.categoryDivider} />
              </div>
              <div className={styles.cards}>
                {cat.cards.map((card) => (
                  <div key={card.title} className={styles.card}>
                    <div className={styles.cardImage}>
                      <img src={card.img} alt={card.title} className={styles.cardImg} />
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                        <p className={styles.cardDesc}>{card.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.execution}>
            <div className={styles.executionInner}>
              <div className={styles.executionContent}>
                <h3 className={styles.executionTitle}>Execution</h3>
                <p className={styles.executionIntro}>Once your plan is set, your concierge handles execution end-to-end:</p>
                <ul className={styles.executionList}>
                  {executionItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.executionDivider} />
              <p className={styles.executionClose}>
                You don&apos;t shop. You don&apos;t research clinics at 2am. You don&apos;t manage logistics. They do.
              </p>
            </div>
            <p className={styles.footer}>Your hair, solved. No more trial and error.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
