import { motion } from "framer-motion";
import { ArrowUpRight, FileCheck2, Landmark, ShieldCheck, Cpu, LineChart, Handshake } from "lucide-react";
import { problems, valueAreas, images } from "@/data/profile";
import { SectionHeader, StaggerGroup, Item, Reveal } from "./motion";
import { scrollToId } from "@/hooks/useLenis";

const icons = { FileCheck2, Landmark, ShieldCheck, Cpu, LineChart, Handshake };

export const Problems = () => (
  <section id="problems" data-testid="problems-section" className="bg-[#F1EFE8] py-24 lg:py-32 relative overflow-hidden">
    <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#E1F5EE] blur-3xl opacity-70 pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative">
      <SectionHeader
        eyebrow="Four problems I solve for owners"
        title="Most owners call me with one of these questions."
      />
      <StaggerGroup className="mt-16 grid md:grid-cols-2 gap-5" delay={0.12}>
        {problems.map((p, i) => (
          <Item key={p.tag}>
            <motion.article
              data-testid={`problem-card-${i + 1}`}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
              className={`group relative h-full rounded-3xl p-8 lg:p-10 border overflow-hidden ${
                i === 0 ? "bg-[#042C53] border-[#042C53] text-white" : "bg-white border-[#D3D1C7] hover:border-[#0F6E56]"
              }`}
            >
              <span className={`absolute top-8 right-8 font-mono text-[0.62rem] tracking-[0.3em] ${i === 0 ? "text-[#85B7EB]" : "text-[#5F5E5A]"}`}>
                0{i + 1}
              </span>
              <p className={`eyebrow ${i === 0 ? "!text-[#85B7EB]" : ""}`}>{p.tag}</p>
              <h3 className={`mt-5 font-serif text-2xl sm:text-3xl font-semibold leading-[1.15] tracking-tight max-w-md ${i === 0 ? "text-white" : "text-[#042C53]"}`}>
                {p.title}
              </h3>
              <p className={`mt-5 text-base leading-relaxed max-w-md ${i === 0 ? "text-[#B5D4F4]" : "text-[#444441]"}`}>{p.body}</p>
              <button
                data-testid={`problem-card-${i + 1}-cta`}
                onClick={() => scrollToId("booking")}
                className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold ${i === 0 ? "text-[#E1F5EE]" : "text-[#0F6E56]"}`}
              >
                Talk about this
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </motion.article>
          </Item>
        ))}
      </StaggerGroup>
    </div>
  </section>
);

export const Value = () => (
  <section id="value" data-testid="value-section" className="bg-[#F8F7F4] py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <div className="lg:col-span-4 lg:sticky lg:top-28">
        <SectionHeader eyebrow="Where I add value" title="Where I usually find problems" />
        <Reveal delay={0.2} className="mt-10 relative rounded-3xl overflow-hidden aspect-[4/3] hidden lg:block">
          <img src={images.planner} alt="Finance planner and budget sheets" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042C53]/80 to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 font-serif text-xl text-white leading-snug">
            Every exposure valued in dirhams. Then you decide.
          </p>
        </Reveal>
      </div>
      <StaggerGroup className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-[#D3D1C7]/70 rounded-3xl overflow-hidden border border-[#D3D1C7]/70" delay={0.08}>
        {valueAreas.map((v, i) => {
          const Icon = icons[v.icon];
          return (
            <Item key={v.title} data-testid={`value-card-${i + 1}`} className="group bg-[#F8F7F4] hover:bg-white p-8 lg:p-10 transition-colors duration-500">
              <div className="w-11 h-11 rounded-xl bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                <Icon size={20} />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#042C53] tracking-tight">{v.title}</h3>
              <p className="mt-3 text-sm md:text-base text-[#444441] leading-relaxed">{v.body}</p>
            </Item>
          );
        })}
      </StaggerGroup>
    </div>
  </section>
);
