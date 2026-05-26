"use client";
import React, { useEffect, useState } from "react";
import styles from "./TermsOfUse.module.css";

const TermsOfUseClient = () => {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/country")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch(() => setCountry("US"));
  }, []);

  return (
    <div className={`${styles.container}     `}>
      <h1 className={`${styles.title}   `}>AestheticMatch Terms of Use</h1>
      <p className={styles.paragraph}>
        <strong>Effective Date:</strong> May 1, 2025
      </p>
      {country === "TR" ? (
        <p className={styles.paragraph}>
          Welcome to AestheticMatch! These Terms of Use (“Terms”) govern your
          use of the AestheticMatch website and services (collectively, the
          “Platform”), operated by Momentum Aksiyon Teknoloji Limited Şti (“we,”
          “us,” “our”).
        </p>
      ) : (
        <p className={styles.paragraph}>
          Welcome to AestheticMatch! These Terms of Use (“Terms”) govern your
          use of the AestheticMatch website and services (collectively, the
          “Platform”), operated by AestheticMatch, Inc. (“we,” “us,” “our”).
        </p>
      )}
      <p className={styles.paragraph}>
        By accessing or using the Platform, you agree to be bound by these
        Terms. If you do not agree, do not use the Platform.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        1. Nature of the Service
      </h2>
      <p className={styles.paragraph}>
        AestheticMatch is a neutral advertising and concierge platform that
        helps users discover and connect with board-certified plastic surgeons.
        We provide personalized matches and administrative support to streamline
        the user’s cosmetic surgery journey.
      </p>
      <p className={styles.paragraph}>
        We do not provide medical services or endorse any specific medical
        provider. AestheticMatch is not a referral service and is not
        compensated based on successful procedures. Surgeons pay fixed,
        pre-determined fees for advertising and booking services.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>2. Eligibility</h2>
      <p className={styles.paragraph}>
        You must be at least 18 years old and legally capable of entering into a
        binding agreement. By using this platform, you represent that you meet
        these requirements.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        3. User Responsibilities
      </h2>
      <p className={styles.paragraph}>
        You agree to use the Platform for lawful purposes only and not to:
      </p>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          Misrepresent your identity or intentions
        </li>
        <li className={styles.listItem}>
          Attempt to manipulate or circumvent the matching process
        </li>
        <li className={styles.listItem}>
          Post or transmit harmful, abusive, defamatory, or otherwise unlawful
          material
        </li>
      </ul>
      <p className={styles.paragraph}>
        We reserve the right to suspend or terminate your access for violations
        of these Terms.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>4. No Medical Advice</h2>
      <p className={styles.paragraph}>
        Information provided on the Platform is not a substitute for
        professional medical advice. You should consult with a licensed
        healthcare provider before making any decisions regarding medical
        treatments or procedures.
      </p>
      <p className={styles.paragraph}>
        AestheticMatch does not employ or supervise surgeons and assumes no
        responsibility for medical decisions, outcomes, or conduct.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        5. Surgeon Participation
      </h2>
      <p className={styles.paragraph}>
        Surgeons listed on the Platform have paid a flat marketing fee for
        visibility and access to potential patients. Their appearance on the
        Platform does not constitute an endorsement or recommendation.
      </p>
      <p className={styles.paragraph}>
        All listed providers must be licensed, board-certified, and in good
        professional standing. We reserve the right to remove any provider for
        cause.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        6. Transparency and Disclosure
      </h2>
      <p className={styles.paragraph}>We disclose to all users that:</p>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          Surgeons pay fees to be listed on the Platform
        </li>
        <li className={styles.listItem}>
          These fees are not tied to the outcome, success, or value of any
          procedures
        </li>
        <li className={styles.listItem}>
          We do not recommend, steer, or favor specific surgeons
        </li>
      </ul>
      <p className={styles.paragraph}>
        This structure complies with federal and state laws, including the
        Anti-Kickback Statute (AKS) and related state rules.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        7. Payment and Refund Policy
      </h2>
      <p className={styles.paragraph}>
        Use of the Platform by users is free. If the Platform begins to charge
        users in the future (e.g., for premium access), those terms will be
        presented in advance.
      </p>
      <p className={styles.paragraph}>
        Surgeons pay fees based on advertising and consult booking only — not on
        patient conversions or completed procedures.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        8. Consultation Guarantee
      </h2>
      <p className={styles.paragraph}>
        If you are matched with a surgeon and book a consultation but are
        determined not to be a candidate for surgery, or you decide not to
        proceed after the consultation, you will not be charged by
        AestheticMatch. We do not accept payment for surgeries, and any fees
        owed to surgeons must be arranged between you and the provider.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        9. Intellectual Property
      </h2>
      <p className={styles.paragraph}>
        All content on the Platform, including design, text, graphics, and
        logos, is the property of AestheticMatch or its licensors and may not be
        copied, reproduced, or distributed without permission.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>
        10. Limitation of Liability
      </h2>
      <p className={styles.paragraph}>
        To the fullest extent permitted by law, AestheticMatch is not liable for
        any damages resulting from your use of the Platform or interactions with
        listed providers. All use is at your own risk.
      </p>

      <h2 className={`${styles.sectionHeading}   `}>11. Modifications</h2>
      <p className={styles.paragraph}>
        We reserve the right to update these Terms at any time. Continued use of
        the Platform after updates means you accept the revised Terms.
      </p>
      <p className={`${styles.paragraph} font-bold mt-8`}>
        All the above categories exclude text messaging originator opt-in data
        and consent; this information will not be shared with any third parties.
      </p>

      <h2 className={`${styles.sectionHeading}   `}> Contact Information</h2>
      <p className={styles.paragraph}>
        <strong>Support:</strong> support@aestheticmatch.com
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

export default TermsOfUseClient;
