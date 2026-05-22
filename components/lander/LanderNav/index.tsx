import Link from "next/link";
import LanderNavCta from "./LanderNavCta";
import styles from "./LanderNav.module.scss";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "What You Get", href: "#what-you-get" },
  { label: "Who It's For", href: "#who-its-for" },
  { label: "FAQ", href: "#faq" },
];

export default function LanderNav() {
  return (
    <header className={styles.header}>
      <nav className={styles.inner}>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>
            AestheticMatch Hair
          </Link>
        </div>

        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.ctaWrap}>
          <LanderNavCta />
        </div>
      </nav>
    </header>
  );
}
