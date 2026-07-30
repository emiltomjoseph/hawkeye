import LandingNavbar from "@/components/landing/LandingNavbar";
import TickRuler from "@/components/landing/TickRuler";
import Hero from "@/components/landing/Hero";
import Introduction from "@/components/landing/Introduction";
import StatsSection from "@/components/landing/StatsSection";
import Features from "@/components/landing/Features";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <>
      <TickRuler />
      <LandingNavbar />
      <main>
        <Hero />
        <Introduction />
        <StatsSection />
        <Features />
        <CTASection />
      </main>
      <LandingFooter />
    </>
  );
}
