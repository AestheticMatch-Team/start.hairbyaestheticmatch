import FAQAccordion from './FAQAccordion'
import styles from './FAQSection.module.scss'

export default function FAQSection() {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.headline}>
          Asked.{' '}
          <em className={styles.headlineItalic}>Answered.</em>
        </h2>
        <div className={styles.body}>
          <FAQAccordion />
        </div>
      </div>
    </section>
  )
}
