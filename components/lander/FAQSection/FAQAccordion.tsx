"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./FAQSection.module.scss";

const faqs = [
  {
    q: "Who actually reads my case?",
    a: "A specialist with clinical background in hair loss reviews your photos, intake responses, and case history. You also get a live meeting with them to walk through the report together.",
  },
  {
    q: "How is this different from a clinic consultation?",
    a: "Clinic consultations are done by providers who profit from what they recommend. We have no products to sell, no surgeries to book, and no referral fees. Our only incentive is getting your case right.",
  },
  {
    q: "What if the plan doesn't work?",
    a: "We don't stop until something does. If the first protocol doesn't get you results, your concierge adjusts it. New approach, new path — we keep going until your hair is solved.",
  },
  {
    q: "Do you earn from surgeon referrals or pharmacy commissions?",
    a: "No. We take $0 in referral fees or commissions from any surgeon, clinic, or pharmacy. Our revenue comes from the assessment fee and optional continued support.",
  },
  {
    q: "What if I don't need anything yet?",
    a: "That's a valid outcome. If your case doesn't warrant treatment, we'll tell you clearly and give you a monitoring plan — including exactly what to watch for and when to act.",
  },
  {
    q: "What if my case is complicated?",
    a: "Complicated cases are what this exists for. If you've tried things that didn't work, or have a history that makes standard protocols questionable, the report addresses all of it.",
  },
  {
    q: "How do you choose surgeons?",
    a: "Every surgeon in our network is vetted on credentials, published outcomes, patient transparency, and technique consistency. We do not accept payment for placement — ever.",
  },
  {
    q: "Can prescriptions actually be issued through this?",
    a: "Yes, through our licensed provider network. If your plan includes oral or topical prescriptions, your concierge handles sourcing and coordination — you don't manage it.",
  },
  {
    q: "Is my information private?",
    a: "Yes. Your photos and data are handled with strict confidentiality and are never shared with third parties without your explicit consent.",
  },
  {
    q: "What if I want a refund?",
    a: "If your report doesn't deliver clarity, we'll fix it - or refund you in full. Your concierge will work directly with you to address anything that falls short. If we can't get you the result you want, we refund you in full.",
  },
];

function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div
      className={`${styles.item} ${open ? styles.itemOpen : ""}`}
      onClick={onToggle}
    >
      <div className={styles.itemContent}>
        <p className={styles.question}>{q}</p>
        <div
          className={styles.answerWrap}
          style={{
            height,
            overflow: "hidden",
            transition: "height 280ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div ref={contentRef}>
            <p className={styles.answer}>{a}</p>
          </div>
        </div>
      </div>
      <div
        className={`${styles.toggleBtn} ${open ? styles.toggleBtnOpen : ""}`}
      >
        {open ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M12 18L12 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.accordion}>
      {faqs.map((faq, i) => (
        <FAQItem
          key={faq.q}
          q={faq.q}
          a={faq.a}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
