import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile, images } from "@/data/profile";
import { MaskedLines, EASE } from "./motion";
import { scrollToId } from "@/hooks/useLenis";

const Portrait = () => {
  const [failed, setFailed] = useState(false);
  return (
    <div
      data-testid="hero-portrait"
      className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-[5px] border-[#F8F7F4] shadow-[0_30px_60px_-20px_rgba(4,44,83,0.6)] bg-[#042C53]"
    >
      {!failed ? (
        <img src="/portrait.jpg" alt={profile.name} className="w-full h-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-[#E1F5EE]">
          <span className="font-serif text-5xl sm:text-6xl font-semibold leading-none">YT</span>
          <span className="font-mono text-[0.55rem] tracking-[0.12em] uppercase mt-2 text-[#85B7EB]">ICAI · 2008</span>
        </div>
      )}
    </div>
  );
};

export const Hero = () => {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 800], [0, 120]);
  const textY = useTransform(scrollY, [0, 800], [0, -60]);

  return (
    <section id="hero" data-testid="hero-section" className="relative min-h-screen pt-[72px] overflow-hidden">
      {/* background grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 left-[12%] w-px bg-[#D3D1C7]/50" />
        <div className="absolute inset-y-0 left-[50%] w-px bg-[#D3D1C7]/40 hidden lg:block" />
        <div className="absolute inset-y-0 right-[8%] w-px bg-[#D3D1C7]/50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-72px)] py-16 lg:py-10">
        {/* copy */}
        <motion.div style={{ y: textY }} className="lg:col-span-7 relative z-10">
          <motion.p
            data-testid="hero-eyebrow"
            className="eyebrow flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.3 }}
          >
            <motion.span
              className="h-px bg-[#0F6E56] inline-block"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.4 }}
            />
            {profile.eyebrow}
          </motion.p>

          <h1
            data-testid="hero-headline"
            className="font-serif font-semibold text-[#042C53] tracking-tight leading-[1.02] text-[2.75rem] sm:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
          >
            <MaskedLines lines={profile.headline.slice(0, 2)} delay={1.45} />
            <MaskedLines lines={[profile.headline[2]]} delay={1.7} lineClass="text-[#0F6E56] italic font-medium" />
          </h1>

          <motion.p
            data-testid="hero-subtitle"
            className="mt-8 max-w-xl text-base md:text-lg text-[#444441] leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 2.0 }}
          >
            {profile.sub}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 2.15 }}
          >
            <button data-testid="hero-primary-cta" onClick={() => scrollToId("booking")} className="btn-pill btn-navy">
              Start with a Health Check <ArrowUpRight size={16} />
            </button>
            <button data-testid="hero-secondary-cta" onClick={() => scrollToId("problems")} className="btn-pill btn-ghost">
              See the four problems I solve
            </button>
          </motion.div>

          <motion.p
            data-testid="hero-credentials"
            className="mt-12 font-mono text-[0.68rem] tracking-[0.06em] uppercase text-[#5F5E5A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.4 }}
          >
            {profile.credentials}
          </motion.p>
        </motion.div>

        {/* spotlight frame */}
        <motion.div
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.9 }}
        >
          <div className="relative aspect-[4/5] max-h-[620px] mx-auto w-full max-w-[460px]">
            <div className="absolute -inset-3 border border-[#0F6E56]/40 spotlight-frame pointer-events-none translate-x-3 translate-y-3" />
            <div className="spotlight-frame relative w-full h-full overflow-hidden bg-[#042C53]">
              <motion.img
                src={images.heroCity}
                alt="Dubai skyline"
                style={{ y: imgY }}
                className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover saturate-[0.85] contrast-[1.05]"
              />
            </div>

            {/* portrait + plate */}
            <div className="absolute -left-6 sm:-left-10 bottom-14 flex items-end gap-4">
              <Portrait />
              <div className="glass border border-[#D3D1C7] rounded-xl px-4 py-3 mb-2 shadow-lg">
                <p className="font-serif text-lg font-semibold text-[#042C53] leading-tight">Yogesh Trivedi</p>
                <p className="font-mono text-[0.6rem] tracking-[0.08em] uppercase text-[#0F6E56] mt-1">Chartered Accountant</p>
              </div>
            </div>

            {/* floating metric */}
            <motion.div
              data-testid="hero-floating-metric"
              className="absolute -right-4 sm:-right-8 top-10 bg-[#0F6E56] text-white rounded-2xl px-5 py-4 shadow-[0_24px_50px_-20px_rgba(15,110,86,0.7)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="font-serif text-3xl font-semibold leading-none">80%</p>
              <p className="font-mono text-[0.6rem] tracking-[0.08em] uppercase mt-2 text-[#E1F5EE]">VAT recovered</p>
            </motion.div>

            <motion.div
              className="absolute right-6 -bottom-6 bg-white border border-[#D3D1C7] rounded-2xl px-5 py-4 shadow-xl"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <p className="font-serif text-2xl font-semibold leading-none text-[#042C53]">17+ yrs</p>
              <p className="font-mono text-[0.6rem] tracking-[0.08em] uppercase mt-2 text-[#5F5E5A]">UAE · Africa · India</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.button
        data-testid="hero-scroll-indicator"
        onClick={() => scrollToId("stats")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-[#5F5E5A]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
      >
        Scroll
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown size={14} />
        </motion.span>
      </motion.button>
    </section>
  );
};
