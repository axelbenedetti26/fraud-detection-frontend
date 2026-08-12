import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { DemoSection } from "@/components/DemoSection";
import { ResultsSection } from "@/components/ResultsSection";
import { TradeoffSection } from "@/components/TradeoffSection";
import { NarrativeSection } from "@/components/NarrativeSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { LimitationsSection } from "@/components/LimitationsSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DemoSection />
        <ResultsSection />
        <TradeoffSection />
        <NarrativeSection />
        <HowItWorksSection />
        <LimitationsSection />
      </main>
      <Footer />
    </>
  );
}
