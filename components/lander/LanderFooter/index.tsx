"use client";

import { useState, useId } from "react";
import styles from "./LanderFooter.module.scss";
function ChevronIcon() {
  return (
    <svg
      className={styles.chevron}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FooterColumnProps = {
  title: string;
  smallTitle?: boolean;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
};

function FooterColumn({ title, smallTitle, links }: FooterColumnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();

  return (
    <div className={styles.col}>
      <button
        type="button"
        className={styles.colHeader}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={listId}
      >
        <span className={`${styles.colTitle}${smallTitle ? ` ${styles.colTitleSmall}` : ""}`}>
          {title}
        </span>
        <ChevronIcon />
      </button>
      <div
        id={listId}
        className={`${styles.links}${!isOpen ? ` ${styles.linksCollapsed}` : ""}`}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={styles.footLink}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function LanderFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.topBrand}>
            <a href="/" className={styles.brand}>
              AestheticMatch <span className={styles.brandHair}>Hair</span>
            </a>
            <p className={styles.tagline}>
              Independent guidance, end-to-end execution. Your hair, solved.
            </p>
          </div>

          <div className={styles.columns}>
            <FooterColumn
              title="Quick links"
              links={[
                { label: "Home", href: "/" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Treatments", href: "/#treatments" },
                { label: "FAQ", href: "/#faq" },
              ]}
            />
            <FooterColumn
              title="Legal & Compliance"
              smallTitle
              links={[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Medical Disclaimer", href: "/medical-disclaimer" },
                {
                  label: "License",
                  href: "https://creativecommons.org/licenses/by/4.0/",
                  external: true,
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 AestheticMatch Hair ·
            <br className={styles.copyrightBreak} /> All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="/terms" className={styles.bottomLink}>
              Terms &amp; Conditions
            </a>
            <a href="/privacy" className={styles.bottomLink}>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
