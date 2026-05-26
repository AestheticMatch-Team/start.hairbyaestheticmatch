"use client";
import React, { useEffect, useState } from "react";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicyClient = () => {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/country")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch(() => setCountry("US"));
  }, []);
  return (
    <div className={`${styles.container} `}>
      <h1 className={`${styles.title} `}>AestheticMatch Privacy Policy</h1>
      <p className={styles.paragraph}>
        <strong>Effective Date:</strong> May 1, 2025
      </p>
      {country === "TR" ? (
        <p className={styles.paragraph}>
          This Privacy Policy explains how Momentum Aksiyon Teknoloji Limited
          Şti d/b/a AestheticMatch ("we," "us," "our") collects, uses, and
          protects your personal information.
        </p>
      ) : (
        <p className={styles.paragraph}>
          This Privacy Policy explains how AestheticMatch ("we," "us," "our")
          collects, uses, and protects your personal information.
        </p>
      )}

      <h2 className={`${styles.sectionHeading}`}>1. Information We Collect</h2>
      <p className={styles.paragraph}>
        We collect the following types of data:
      </p>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <strong>Contact information</strong>: name, email address, phone
          number
        </li>
        <li className={styles.listItem}>
          <strong>User preferences</strong>: procedure interests, location, and
          surgeon preferences
        </li>
        <li className={styles.listItem}>
          <strong>Activity data</strong>: appointment requests, forms submitted,
          support messages
        </li>
      </ul>
      <p className={styles.paragraph}>
        We do <strong>not collect</strong> health records or insurance details.
      </p>

      <h2 className={`${styles.sectionHeading} `}>
        2. How We Use Your Information
      </h2>
      <p className={styles.paragraph}>We use your information to:</p>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          Match you with surgeons based on your preferences
        </li>
        <li className={styles.listItem}>Facilitate consultation scheduling</li>
        <li className={styles.listItem}>Provide customer support</li>
        <li className={styles.listItem}>
          Improve our service and website experience
        </li>
      </ul>
      <p className={styles.paragraph}>
        We <strong>do not sell or share your personal information</strong> with
        third parties for commercial gain.
      </p>

      <h2 className={`${styles.sectionHeading}  `}>
        3. Information Sharing with Surgeons
      </h2>
      <p className={styles.paragraph}>
        When you request a match, we share your basic contact details and
        interest profile with relevant surgeons to facilitate the consultation.
      </p>
      <p className={styles.paragraph}>
        Surgeons are required to protect your data under their own privacy
        policies.
      </p>

      <h2 className={`${styles.sectionHeading}  `}>
        4. Legal Compliance and Disclosures
      </h2>
      <p className={styles.paragraph}>
        We may disclose your information if required by law or if necessary to:
      </p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Comply with legal obligations</li>
        <li className={styles.listItem}>Prevent fraud or abuse</li>
        <li className={styles.listItem}>Protect our rights or safety</li>
      </ul>

      <h2 className={`${styles.sectionHeading}  `}>
        5. Platform Structure and Compliance
      </h2>
      <p className={styles.paragraph}>
        We are a <strong>marketing and booking platform</strong>, not a medical
        service provider. We collect and use user data{" "}
        <strong>
          only for the purpose of connecting patients with licensed,
          board-certified surgeons
        </strong>
        .
      </p>
      <p className={styles.paragraph}>
        Surgeons pay a flat marketing fee. AestheticMatch does{" "}
        <strong>not</strong> take a commission or "success fee" on surgeries.
        Our business model has been legally vetted and designed to comply with:
      </p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Federal Anti-Kickback Statute (AKS)</li>
        <li className={styles.listItem}>
          State-level anti-fee-splitting and advertising laws (e.g., CA, NY, TX,
          FL)
        </li>
      </ul>
      <p className={styles.paragraph}>
        We <strong>disclose clearly</strong> that we are a paid platform and{" "}
        <strong>do not endorse or steer users</strong> to any specific surgeon.
      </p>

      <h2 className={`${styles.sectionHeading}  `}>6. Cookies and Analytics</h2>
      <p className={styles.paragraph}>
        We may use cookies to understand how users interact with the Platform
        and to improve performance. This data is anonymized and not tied to your
        personal identity.
      </p>

      <h2 className={`${styles.sectionHeading}  `}>7. Your Rights</h2>
      <p className={styles.paragraph}>You may:</p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Request access to your data</li>
        <li className={styles.listItem}>Request deletion of your data</li>
        <li className={styles.listItem}>
          Opt out of communications at any time
        </li>
      </ul>
      <p className={styles.paragraph}>
        Contact support@aestheticmatch.com to make any of these requests.
      </p>

      <h2 className={`${styles.sectionHeading}  `}>8. Data Security</h2>
      <p className={styles.paragraph}>
        We use industry-standard encryption and access controls to protect your
        information. However, no method of transmission over the internet is
        100% secure.
      </p>

      <h2 className={`${styles.sectionHeading}  `}>
        9. Updates to This Policy
      </h2>
      <p className={styles.paragraph}>
        We may revise this Privacy Policy periodically. The latest version will
        always be available on our website.
      </p>

      <h2 className={`${styles.sectionHeading}  `}>10. Contact</h2>
      <p className={styles.paragraph}>
        For any questions regarding this policy:
      </p>
      <p className={styles.paragraph}>
        <strong>Email:</strong> support@aestheticmatch.com
      </p>
      <p className={styles.paragraph}>
        <strong>Office:</strong>{" "}
        {country === "TR"
          ? "Bebek Mah. Arifipaşa Sk. Saba Apartmanı No: 22 İç Kapı No: 3 Beşiktaş / İstanbul"
          : "30 N Gould St, Ste R, Sheridan, WY 82801"}
      </p>
    </div>
  );
};

export default PrivacyPolicyClient;
