import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Introduction from "@/components/landing/Introduction";
import StatsSection from "@/components/landing/StatsSection";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Hero />
        <Introduction />
        <StatsSection />
        <Features />
        <HowItWorks />
        <CTASection />
      </main>
      <LandingFooter />
    </>
  );
}
