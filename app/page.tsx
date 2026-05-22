import LanderNav from "@/components/lander/LanderNav";
import LanderHero from "@/components/lander/LanderHero";
import OurPartnerSection from "@/components/lander/OurPartnerSection";
import StatementSection from "@/components/lander/StatementSection";
import HowYourCaseSection from "@/components/lander/HowYourCaseSection";
import ProblemSection from "@/components/lander/ProblemSection";
import WhoThisIsSection from "@/components/lander/WhoThisIsSection";
import TreatmentsSection from "@/components/lander/TreatmentsSection";
import WhatYouGetSection from "@/components/lander/WhatYouGetSection";
import AdviceSection from "@/components/lander/AdviceSection";
import StoriesSection from "@/components/lander/StoriesSection";
import CTASection from "@/components/lander/CTASection";
import FAQSection from "@/components/lander/FAQSection";
import LanderFooter from "@/components/lander/LanderFooter";

export default function HomePage() {
  return (
    <main
      className="bg-white"
      style={{
        fontFamily: "var(--font-manrope-lander), sans-serif",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <LanderNav />
      <LanderHero />
      <OurPartnerSection />
      <StatementSection />
      <HowYourCaseSection />
      <ProblemSection />
      <WhoThisIsSection />
      <TreatmentsSection />
      <WhatYouGetSection />
      <AdviceSection />
      <StoriesSection />
      <CTASection />
      <FAQSection />
      <LanderFooter />
    </main>
  );
}
