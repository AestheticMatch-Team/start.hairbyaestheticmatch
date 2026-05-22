import styles from './MembershipSection.module.scss'

const steps = [
  {
    number: '1',
    title: 'Concierge Guidance',
    desc: 'A dedicated expert to help you navigate every decision — from shortlisting surgeons to planning next steps. No guesswork, just clear direction.',
  },
  {
    number: '2',
    title: 'Plan Execution',
    desc: 'We turn your report into action. Step-by-step support to move forward with confidence, timelines, and the right priorities.',
  },
  {
    number: '3',
    title: 'Provider Introductions',
    desc: 'Direct access to vetted surgeons who match your case — not paid placements, but true fit based on your needs and goals.',
  },
  {
    number: '4',
    title: 'Ongoing Support',
    desc: "Questions, second thoughts, new options — we stay with you throughout the process so you're never making decisions alone.",
  },
]

export default function MembershipSection() {
  return (
    <section id="membership" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.headline}>
            What Membership{' '}
            <em className={styles.headlineItalic}>Unlocks</em>
          </h2>
          <div className={styles.headerRight}>
            <p className={styles.subhead}>
              Ongoing support to help you act on your plan — with guidance, access, and clarity at every step.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.steps}>
            {steps.map((step) => (
              <div key={step.number} className={styles.step}>
                <div className={styles.stepTop}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <p className={styles.stepTitle}>{step.title}</p>
                </div>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelText}>
              <p className={styles.panelTitle}>
                Aesthetic Match Hair
                <br />
                <em className={styles.panelTitleItalic}>Membership</em>
              </p>
              <p className={styles.panelPrice}>
                $99/month{' '}
                <em className={styles.panelPriceItalic}>unlocks</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
