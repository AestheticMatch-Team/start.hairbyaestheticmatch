import styles from './OurPartnerSection.module.scss'

// widths derived from each SVG's viewBox at 29px height
const logos = [
  { src: '/hair-lander/press-cnbc.svg',             alt: 'CNBC',            w: 37  },
  { src: '/hair-lander/press-business-insider.svg', alt: 'Business Insider', w: 93  },
  { src: '/hair-lander/press-yahoo.svg',            alt: 'Yahoo!',           w: 103 },
  { src: '/hair-lander/press-abc.svg',              alt: 'ABC',              w: 29  },
  { src: '/hair-lander/press-forbes.svg',           alt: 'Forbes Health',    w: 205 },
]

export default function OurPartnerSection() {
  return (
    <section className={styles.section}>
      {/* Desktop */}
      <div className={styles.desktop}>
        <p className={styles.label}>As seen in</p>
        {logos.map((logo) => (
          <img
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.w}
            height={29}
            className={styles.logoImg}
          />
        ))}
      </div>

      {/* Mobile — infinite scroll marquee */}
      <div className={styles.mobile}>
        <div className={styles.track}>
          {[...logos, ...logos].map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={29}
              className={styles.logoImg}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
