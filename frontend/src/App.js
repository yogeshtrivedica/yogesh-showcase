import { useLenis } from "@/hooks/useLenis";
import { Preloader } from "@/components/landing/Preloader";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Stats, Intro } from "@/components/landing/Stats";
import { Problems, Value } from "@/components/landing/Problems";
import { Process, Automation } from "@/components/landing/Process";
import { Results, Career, Credentials } from "@/components/landing/Results";
import { Contact } from "@/components/landing/Contact";
import { Booking } from "@/components/landing/Booking";

function App() {
  useLenis();

  return (
    <div className="grain min-h-screen bg-[#F8F7F4] text-[#042C53]" data-testid="landing-page">
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Intro />
        <Problems />
        <Value />
        <Process />
        <Automation />
        <Results />
        <Career />
        <Credentials />
        <Booking />
        <Contact />
      </main>
    </div>
  );
}

export default App;
