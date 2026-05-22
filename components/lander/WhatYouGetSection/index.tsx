import Image from 'next/image'
import {
  IconCurrentLocation,
  IconChartHistogram,
  IconChartBarPopular,
  IconRosetteDiscountCheck,
  IconClipboardText,
  IconFlag,
} from '../Icons'
import styles from './WhatYouGetSection.module.scss'

const items = [
  {
    num: '01',
    title: 'Diagnosis',
    desc: 'The actual cause of your hair loss. Pattern, stage, contributing factors, and any non-AGA findings flagged.',
    Icon: IconCurrentLocation,
  },
  {
    num: '02',
    title: 'Progression Forecast',
    desc: 'Where your hair is likely headed in 1, 3, and 5 years if you do nothing — and how that changes with each treatment path.',
    Icon: IconChartHistogram,
  },
  {
    num: '03',
    title: 'Visualization',
    desc: 'Side-by-side projections of realistic outcomes across treatment scenarios. Clinical projections, not marketing renders.',
    Icon: IconChartBarPopular,
  },
  {
    num: '04',
    title: 'Candidacy',
    desc: 'We evaluate your eligibility for every treatment, with medical reasoning behind each call.',
    Icon: IconRosetteDiscountCheck,
  },
  {
    num: '05',
    title: 'Recommendations',
    desc: 'Recommended protocols or procedures, ranked by fit — including "do nothing yet" when appropriate.',
    Icon: IconClipboardText,
  },
  {
    num: '06',
    title: 'Execution Plan',
    desc: "Step-by-step next actions. Who you'll see, what you'll do, and what your concierge handles for you.",
    Icon: IconFlag,
  },
]

export default function WhatYouGetSection() {
  return (
    <section id="what-you-get" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>What Your Report Contains</p>
          <h2 className={styles.headline}>
            Your case.{' '}
            <em className={styles.headlineItalic}>
              Read the way a clinician would read it.
            </em>
          </h2>
          <p className={styles.subhead}>
            A specialist reviews your photos, intake, and history, then delivers a structured clinical assessment within 72 hours.
          </p>
        </div>

        <div className={styles.gridWrap}>
          <svg
            className={styles.connectorLeft}
            viewBox="0 0 62 480"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="55.5" cy="6" r="6" fill="#4F6A98" />
            <circle cx="55.5" cy="240" r="6" fill="#4F6A98" />
            <circle cx="55.5" cy="474" r="6" fill="#4F6A98" />
            <path
              d="M55.5 6.5H22.1C13.1006 6.5 8.60096 6.5 5.44658 8.7918C4.42784 9.53195 3.53195 10.4278 2.7918 11.4466C0.5 14.601 0.5 19.1006 0.5 28.1V218.9C0.5 227.899 0.5 232.399 2.7918 235.553C3.53195 236.572 4.42784 237.468 5.44658 238.208C8.60096 240.5 13.1006 240.5 22.1 240.5H54.5"
              stroke="#5A7A96"
              strokeDasharray="4 4"
            />
            <path
              d="M55.5 240H22.1C13.1006 240 8.60096 240 5.44658 242.292C4.42784 243.032 3.53195 243.928 2.7918 244.947C0.5 248.101 0.5 252.601 0.5 261.6V452.4C0.5 461.399 0.5 465.899 2.7918 469.053C3.53195 470.072 4.42784 470.968 5.44658 471.708C8.60096 474 13.1006 474 22.1 474H54.5"
              stroke="#5A7A96"
              strokeDasharray="4 4"
            />
          </svg>
          <svg
            className={styles.connectorRight}
            viewBox="0 0 137 480"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="131" cy="6" r="6" fill="#4F6A98" />
            <circle cx="131" cy="240" r="6" fill="#4F6A98" />
            <circle cx="131" cy="474" r="6" fill="#4F6A98" />
            <path
              d="M127 240H93.6C84.6006 240 80.101 240 76.9466 242.292C75.9278 243.032 75.032 243.928 74.2918 244.947C72 248.101 72 252.601 72 261.6V452.4C72 461.399 72 465.899 74.2918 469.053C75.032 470.072 75.9278 470.968 76.9466 471.708C80.101 474 84.6006 474 93.6 474H126"
              stroke="#5A7A96"
              strokeDasharray="4 4"
            />
            <path
              d="M127 6H93.6C84.6006 6 80.101 6 76.9466 8.2918C75.9278 9.03195 75.032 9.92784 74.2918 10.9466C72 14.101 72 18.6006 72 27.6V218.4C72 227.399 72 231.899 74.2918 235.053C75.032 236.072 75.9278 236.968 76.9466 237.708C80.101 240 84.6006 240 93.6 240H126"
              stroke="#5A7A96"
              strokeDasharray="4 4"
            />
            <path
              d="M0 474H22.5C29.1274 474 34.5 468.627 34.5 462V18C34.5 11.3726 39.8726 6 46.5 6H127"
              stroke="#5A7A96"
              strokeDasharray="4 4"
            />
          </svg>

          <div className={styles.grid}>
            {items.map(({ num, title, desc, Icon }, i) => {
              return (
              <article key={num} className={styles.card}>
                {i < items.length - 1 && (i % 2 === 0 ? (
                  <>
                    <span className={styles.mobileDotLeft} aria-hidden="true" />
                    <svg
                      className={styles.mobileLineLeft}
                      viewBox="0 0 23 127"
                      preserveAspectRatio="none"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 0V114.5C4 121.127 9.37258 126.5 16 126.5H23"
                        stroke="#5A7A96"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <span className={styles.mobileDotRight} aria-hidden="true" />
                    <svg
                      className={styles.mobileLineRight}
                      viewBox="0 0 24 145"
                      preserveAspectRatio="none"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 0V132C20 138.627 14.6274 144 8 144H0"
                        stroke="#5A7A96"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  </>
                ))}
                <div className={styles.cardNum}>
                  <span>{num}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardIcon}>
                      <Icon size={24} />
                    </span>
                    <h3 className={styles.cardTitle}>{title}</h3>
                  </div>
                  <p className={styles.cardDesc}>{desc}</p>
                </div>
              </article>
              )
            })}
          </div>
        </div>

        <div className={styles.mockup}>
          <div className={styles.mockupBadge}>
            <span className={styles.mockupBadgeDot} aria-hidden="true" />
            Mockup Report
          </div>
          <div className={styles.mockupGrid}>
            <div className={styles.mockupFrame}>
              <Image
                src="/hair-lander/report-mockup-1.png"
                alt="Sample clinical report — Hair Restoration Index"
                fill
                sizes="(max-width: 768px) 100vw, 525px"
                className={styles.mockupImg}
              />
            </div>
            <div className={styles.mockupFrame}>
              <Image
                src="/hair-lander/report-mockup-2.png"
                alt="Sample clinical report — Procedure Comparison"
                fill
                sizes="(max-width: 768px) 100vw, 525px"
                className={styles.mockupImg}
              />
            </div>
          </div>
          <p className={styles.mockupCaption}>
            Each report is reviewed and signed by a clinical specialist. No automated diagnosis.
          </p>
        </div>
      </div>
    </section>
  )
}
