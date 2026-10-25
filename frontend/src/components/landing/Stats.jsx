import { motion } from "framer-motion";
import { stats, profile } from "@/data/profile";
import { StaggerGroup, Item, Reveal } from "./motion";

export const Stats = () => (
  <section id="stats" data-testid="stats-strip-container" className="bg-[#F8F7F4] border-b border-[#D3D1C7]/60">
    <StaggerGroup className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-2 lg:grid-cols-4" delay={0.12}>
      {stats.map((s, i) => (
        <Item
          key={s.value}
          data-testid={`stat-item-${i + 1}`}
          className={`py-12 lg:py-16 pr-6 ${i !== 0 ? "lg:border-l lg:border-[#D3D1C7]/70 lg:pl-8" : ""} ${
            i % 2 === 1 ? "border-l border-[#D3D1C7]/70 pl-6 lg:pl-8" : ""
          } ${i > 1 ? "border-t border-[#D3D1C7]/70 lg:border-t-0" : ""}`}
        >
          <p className="font-mono text-[0.6rem] tracking-[0.12em] text-[#0F6E56] mb-4">0{i + 1}</p>
          <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#042C53] leading-none tracking-tight">{s.value}</p>
          <p className="mt-4 text-sm text-[#5F5E5A] leading-relaxed max-w-[220px]">{s.label}</p>
        </Item>
      ))}
    </StaggerGroup>
  </section>
);

export const Intro = () => (
  <section id="intro" data-testid="intro-section" className="bg-[#F8F7F4] py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-12 gap-12">
      <Reveal className="lg:col-span-4">
        <p className="eyebrow mb-5">Who I am</p>
        <p className="font-serif italic text-2xl sm:text-3xl text-[#042C53] leading-snug">
          “I don't replace your accountant or your software. I check them.”
        </p>
      </Reveal>
      <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.15}>
        <div className="relative pl-8">
          <motion.span
            className="absolute left-0 top-0 w-1 bg-[#0F6E56] rounded-full"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
          />
          <p className="text-lg md:text-xl text-[#2C2C2A] leading-relaxed">{profile.intro}</p>
          <p className="mt-6 font-mono text-[0.68rem] tracking-[0.07em] uppercase text-[#5F5E5A]">{profile.credentials}</p>
        </div>
      </Reveal>
    </div>
  </section>
);
