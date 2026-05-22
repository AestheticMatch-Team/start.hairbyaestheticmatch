import styles from './WhoThisIsSection.module.scss'

const cards = [
  {
    img: '/hair-lander/stage-noticing.png',
    title: 'Just Noticing',
    quote: '"Is this normal, or is something happening?"',
    desc: "We diagnose what's actually going on, identify whether you need to act now or monitor, and put the right early intervention in motion before you lose ground.",
  },
  {
    img: '/hair-lander/stage-tried.png',
    title: 'Tried Things',
    quote: '"Why didn\'t anything work?"',
    desc: 'We figure out why your previous treatments missed, identify the protocol your biology actually responds to, and execute it — properly this time.',
  },
  {
    img: '/hair-lander/stage-surgery.png',
    title: 'Considering Surgery',
    quote: '"Am I actually a candidate?"',
    desc: 'We assess your candidacy, identify the right surgeon and technique for your case, and coordinate the procedure end to end.',
  },
  {
    img: '/hair-lander/stage-advanced.png',
    title: 'Already Advanced',
    quote: '"What\'s still possible?"',
    desc: "We map what's preservable and restorable, identify the combination of treatments that produces a real outcome for your case, and execute every part of it.",
  },
]

const trCards = [
  {
    img: '/hair-lander/stage-noticing.png',
    title: 'Just Noticing',
    quote: '"Is this normal, or is something happening?"',
    desc: "Start in the app. A guided scan tells you whether what you're seeing is normal shedding or early pattern hair loss, hands you the right early-intervention protocol, and shows you what to act on now — before you lose ground you can't get back.",
  },
  {
    img: '/hair-lander/stage-tried.png',
    title: 'Tried Things',
    quote: '"Why didn\'t anything work?"',
    desc: "Log what you've tried in the app. It surfaces why those treatments missed, identifies the protocol your biology actually responds to, and hands you a corrected path — executed properly this time.",
  },
  {
    img: '/hair-lander/stage-surgery.png',
    title: 'Considering Surgery',
    quote: '"Am I actually a candidate?"',
    desc: 'The app assesses whether you\'re a real surgical candidate and identifies the right technique for your case. The concierge matches you to the right surgeon and coordinates the procedure end to end.',
  },
  {
    img: '/hair-lander/stage-advanced.png',
    title: 'Already Advanced',
    quote: '"What\'s still possible?"',
    desc: "The app maps what's preservable and what's restorable, then builds the combination protocol that produces a real outcome for your case. The concierge executes every part of it.",
  },
]

type WhoThisIsSectionProps = {
  isTurkey?: boolean
}

export default function WhoThisIsSection({ isTurkey = false }: WhoThisIsSectionProps) {
  const activeCards = isTurkey ? trCards : cards
  return (
    <section id="who-its-for" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            {isTurkey ? 'One App. Every Stage.' : 'Built For Every Stage'}
          </p>
          <h2 className={styles.headline}>
            Hair loss isn&apos;t one problem.{' '}
            <em className={styles.headlineItalic}>
              And there&apos;s no one-size-fits-all answer.
            </em>
          </h2>
          <p className={styles.subhead}>
            {isTurkey ? (
              <>
                The right path for a man in early thinning isn&apos;t the right path for a man five
                years in. The app diagnoses where you actually are, builds the protocol that works
                for your case, and the concierge executes it.
              </>
            ) : (
              <>
                The right path for a man in early thinning isn&apos;t the right path for a man five
                years in. We diagnose where you actually are, identify the treatment that works for
                your case, and execute it.
              </>
            )}
          </p>
        </div>

        <div className={styles.cards}>
          {activeCards.map((card) => (
            <div key={card.title} className={styles.card}>
              <div className={styles.cardPhoto}>
                <img src={card.img} alt={card.title} className={styles.cardImg} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardQuote}>{card.quote}</p>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.footer}>
          {isTurkey
            ? 'Wherever you are on the curve — your path is in the app. No more trial and error.'
            : 'Wherever you are on the curve — your hair, solved. No more trial and error.'}
        </p>
      </div>
    </section>
  )
}
