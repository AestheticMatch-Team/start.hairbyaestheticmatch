import Image from 'next/image'
import styles from './HowYourCaseSection.module.scss'

const steps = [
  {
    num: '1',
    title: 'The Report',
    desc: 'A board-certified specialist reviews your photos, intake, and history. You get a structured clinical report in 72 hours: your diagnosis, your candidacy across every viable treatment, and the recommended path for your case.',
    caption: 'Reviewed and signed by a real specialist. No algorithmic shortcut.',
    img: '/hair-lander/platform-report.png',
    imgAlt: 'Personalized hair assessment report',
    imgH: 270,
  },
  {
    num: '2',
    title: 'The Specialist Meeting',
    desc: "You meet with your concierge specialist to walk through the report. They explain what's happening, why your case calls for the recommended path, and exactly what comes next. Questions answered in plain English. No sales pitch, no upsell.",
    caption: null,
    img: '/hair-lander/platform-meeting.png',
    imgAlt: 'Specialist consultation meeting',
    imgH: 250,
  },
  {
    num: '3',
    title: 'Execution',
    desc: "Your concierge handles every step. They get you the prescription through a licensed prescribing provider. They source the protocol or compounded formulation. They coordinate the surgical consult, vet the surgeon, and prep you for the procedure. They track your progress and adjust the plan if it isn't working.",
    caption: 'You move forward without managing logistics.',
    img: '/hair-lander/platform-execution.png',
    imgAlt: 'Concierge execution — treatment ecosystem',
    imgH: 250,
  },
]

export default function HowYourCaseSection() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>The Platform</p>
          <h2 className={styles.headline}>
            Diagnosed. Planned. <em className={styles.headlineItalic}>Executed.</em>
          </h2>
          <p className={styles.subhead}>
            Three steps. One outcome. Your hair situation handled by a real clinical operation, not a subscription site.
          </p>
        </div>

        <div className={styles.container}>
          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div key={step.num} className={`${styles.step} ${i === 1 ? styles.stepMuted : ''}`}>
                <div className={styles.stepContent}>
                  <div className={styles.stepMeta}>
                    <div className={styles.stepBadge}>{step.num}</div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                  </div>
                  <div className={styles.stepText}>
                    <p className={styles.stepDesc}>{step.desc}</p>
                    {step.caption && <p className={styles.stepCaption}>{step.caption}</p>}
                  </div>
                </div>
                <div className={styles.stepImage} style={{ height: step.imgH }}>
                  <Image src={step.img} alt={step.imgAlt} fill className={styles.img} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className={styles.footer}>One assessment. One concierge. End-to-end. Your hair, solved.</p>
      </div>
    </section>
  )
}
