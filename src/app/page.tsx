import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Collabs, Fairness } from "@/components/sections/collabs";
import { Apply } from "@/components/sections/apply";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";

/** The landing page. Reorder or remove sections here. */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Collabs />
        <Fairness />
        <Apply />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
