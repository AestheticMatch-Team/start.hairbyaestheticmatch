import styles from './StoriesSection.module.scss'

const stories = [
  {
    label: 'STORY 1 — COMBINATION PATH',
    name: 'Daniel R, 34',
    path: 'Started Norwood III · Path: FUE transplant + oral finasteride · 12 months post-op',
    before: '/hair-lander/story1-before.jpg',
    after: '/hair-lander/story1-after.jpg',
    quote:
      "“Meds couldn't rebuild what I'd already lost — only protect what was left. The report made that clear. Twelve months post-op with fin holding the rest, my hairline's where it was at 28.”",
  },
  {
    label: 'STORY 2 — CROWN RESTORATION PATH',
    name: 'Marcus L, 31',
    path: 'Started Norwood IV vertex · Path: FUE crown restoration + oral finasteride · 14 months post-op',
    before: '/hair-lander/story2-before.jpg',
    after: '/hair-lander/story2-after.jpg',
    quote:
      '“Three consultations, three different graft counts. The report told me what I actually needed, and the concierge matched me with a surgeon who specializes in crown work — not whoever happened to take my call.”',
  },
  {
    label: 'STORY 3 — EARLY INTERVENTION PATH',
    name: 'Diego M, 37',
    path: 'Started Norwood I–II · Path: Dermatologist-led monitoring + oral finasteride · 18 months',
    before: '/hair-lander/story3-before.jpg',
    after: '/hair-lander/story3-after.jpg',
    quote:
      "“Three clinics quoted me three different graft counts. The report said I didn't need any of them — and the concierge matched me with a dermatologist, not a surgeon. Eighteen months in, my hairline has progressed for the better.”",
  },
  {
    label: 'STORY 4 — "NOT YET" PATH',
    name: 'Arjun P, 27',
    path: 'Started Norwood II–III · Path: PRP series + topical finasteride + minoxidil · 9 months',
    before: '/hair-lander/story4-before.jpg',
    after: '/hair-lander/story4-after.jpg',
    quote:
      '“Two years on minoxidil and I was still losing ground. The report identified what was actually driving my pattern — DHT, untreated — and added topical fin and PRP. Nine months in, the front is denser than it’s been in three years.”',
  },
]

export default function StoriesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>What Solved Looks Like</p>
          <h2 className={styles.headline}>
            Real members.{' '}
            <em className={styles.headlineItalic}>Real paths. Real outcomes.</em>
          </h2>
          <p className={styles.subhead}>
            Each of these men came in asking the same question: what should I actually be doing? Each got a different answer. Each got it solved.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.row}>
            {stories.slice(0, 2).map((story) => (
              <StoryCard key={story.label} story={story} />
            ))}
          </div>
          <div className={styles.row}>
            {stories.slice(2).map((story) => (
              <StoryCard key={story.label} story={story} />
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerTitle}>Four men. Four different paths. One outcome.</p>
          <p className={styles.footerSub}>Your hair, solved.</p>
        </div>
      </div>
    </section>
  )
}

function StoryCard({ story }: { story: typeof stories[0] }) {
  return (
    <div className={styles.card}>
      <p className={styles.storyLabel}>{story.label}</p>
      <div className={styles.storyMeta}>
        <p className={styles.storyName}>{story.name}</p>
        <p className={styles.storyPath}>{story.path}</p>
      </div>
      <div className={styles.photos}>
        <div className={styles.photoWrap}>
          <img src={story.before} alt="Before" className={styles.photo} />
          <span className={styles.badge}>BEFORE</span>
        </div>
        <div className={styles.photoWrap}>
          <img src={story.after} alt="After" className={styles.photo} />
          <span className={styles.badge}>AFTER</span>
        </div>
      </div>
      <p className={styles.quote}>{story.quote}</p>
    </div>
  )
}
