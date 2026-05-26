"use client";
import React, { useEffect, useState } from "react";
import styles from "./MedicalDisclaimer.module.css";

const MedicalDisclaimerClient = () => {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/country")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch(() => setCountry("US"));
  }, []);

  return (
    <div className={`${styles.container} `}>
      <h1 className={`${styles.title} `}>
        AestheticMatch Medical Disclaimer and Safety Information
      </h1>
      <p className={styles.paragraph}>
        <strong>Effective Date:</strong> May 1, 2025
      </p>
      <p className={styles.paragraph}>
        This Medical Disclaimer and Safety Information explains the limits of
        AestheticMatch's services and provides general safety guidance for users
        exploring aesthetic and cosmetic procedures through the AestheticMatch
        website and services (collectively, the "Platform"). By using the
        Platform, you acknowledge and agree to the terms below. This page should
        be read together with our Terms of Use and Privacy Policy.
      </p>

      <h2 className={`${styles.sectionHeading}`}>
        1. AestheticMatch Is Not a Medical Provider
      </h2>
      <p className={styles.paragraph}>
        AestheticMatch is a marketing, matching, and concierge support platform.
        We are not a hospital, clinic, or medical practice, and we do not
        provide medical services.
      </p>

      <h2 className={`${styles.sectionHeading}`}>2. No Medical Advice</h2>
      <p className={styles.paragraph}>
        Nothing on the Platform, including educational content, concierge
        communications, suggested matches, or general guidance, is medical
        advice. AestheticMatch does not diagnose conditions, recommend
        treatments, provide clinical instructions, prescribe medications, or
        offer medical opinions. Always consult directly with a licensed
        healthcare provider for medical decisions.
      </p>

      <h2 className={`${styles.sectionHeading}`}>3. Not for Emergencies</h2>
      <p className={styles.paragraph}>
        The Platform is not intended for medical emergencies. If you believe you
        may be experiencing an emergency, call 911 or go to the nearest emergency
        room immediately. Do not rely on AestheticMatch for urgent or time
        sensitive medical issues.
      </p>

      <h2 className={`${styles.sectionHeading}`}>4. What AestheticMatch Does</h2>
      <p className={styles.paragraph}>
        AestheticMatch helps users explore options and connect with providers by
        collecting and reviewing user preferences and interest information (for
        example, procedure interests, location, timeline, and provider
        preferences), then suggesting potential matches based on alignment with
        provider profiles and availability. We may also provide administrative
        support, such as helping coordinate consultations and basic logistics.
      </p>

      <h2 className={`${styles.sectionHeading}`}>
        5. Your Choice, Your Responsibility
      </h2>
      <p className={styles.paragraph}>
        Any match or provider suggestion is informational only. You are never
        required to choose a provider, book a consultation, or proceed with any
        procedure. The decision to consult with, hire, or receive care from any
        provider is entirely yours, and you should make that decision only after
        speaking directly with the provider and receiving all required
        disclosures, risks, and informed consent.
      </p>

      <h2 className={`${styles.sectionHeading}`}>6. Providers Are Independent</h2>
      <p className={styles.paragraph}>
        Providers you interact with through the Platform are independent
        professionals. AestheticMatch does not employ, supervise, or control
        providers, and we do not control clinical decisions, medical care,
        facilities, anesthesia, prescriptions, aftercare plans, or outcomes.
        Providers are solely responsible for their services, advice, conduct, and
        results.
      </p>

      <h2 className={`${styles.sectionHeading}`}>7. Safety and Due Diligence</h2>
      <p className={styles.paragraph}>
        Cosmetic and aesthetic procedures carry risks, including complications and
        unexpected outcomes. You should ask providers about their credentials,
        relevant experience, facility and anesthesia safety, risks and
        alternatives, recovery expectations, total costs, and what happens if
        complications occur. You should also confirm licensure and credentials
        through appropriate official sources.
      </p>

      <h2 className={`${styles.sectionHeading}`}>8. Post Procedure Support</h2>
      <p className={styles.paragraph}>
        If AestheticMatch offers check-ins or follow-up communication, it is
        administrative and supportive only. We do not evaluate medical symptoms,
        assess healing, interpret photos, or provide clinical instructions. For
        any medical questions, concerns, or changes in symptoms, contact your
        provider directly.
      </p>

      <h2 className={`${styles.sectionHeading}`}>9. No Guarantees</h2>
      <p className={styles.paragraph}>
        Results vary by patient and procedure. AestheticMatch does not guarantee
        outcomes, satisfaction, timing, availability, pricing, or results.
      </p>

      <h2 className={`${styles.sectionHeading}`}>10. Limitation of Liability</h2>
      <p className={styles.paragraph}>
        To the fullest extent permitted by law, AestheticMatch is not liable for
        any damages arising from your use of the Platform or your interactions
        with providers, including any medical services you receive from
        providers. Use of the Platform is at your own risk. Some jurisdictions do
        not allow certain limitations, so portions of this section may not apply
        to you.
      </p>

      <h2 className={`${styles.sectionHeading}`}>11. Updates</h2>
      <p className={styles.paragraph}>
        We may update this page from time to time. The latest version will be
        posted on our website with the effective date.
      </p>

      <h2 className={`${styles.sectionHeading}`}>12. Contact</h2>
      <p className={styles.paragraph}>
        If you have questions about this page, contact us at:
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

export default MedicalDisclaimerClient;

