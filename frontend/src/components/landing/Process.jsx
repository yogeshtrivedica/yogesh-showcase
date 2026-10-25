import { motion } from "framer-motion";
import { Bot, GitMerge, ScanSearch, Gauge } from "lucide-react";
import { steps, images } from "@/data/profile";
import { SectionHeader, StaggerGroup, Item, Reveal, EASE } from "./motion";

export const Process = () => (
  <section id="process" data-testid="process-section" className="bg-[#F8F7F4] py-24 lg:py-32 border-t border-[#D3D1C7]/60">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
      <SectionHeader
        eyebrow="How I work"
        title="How we work together. You decide at every step."
        intro="Nothing in your system changes until you have seen the findings and decided what is worth fixing."
      />
      <StaggerGroup className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8" delay={0.14}>
        {steps.map((s, i) => (
          <Item key={s.n} data-testid={`process-step-${i + 1}`} className="relative group">
            <motion.div
              className="h-[3px] bg-[#D3D1C7] rounded-full overflow-hidden"
            >
              <motion.span
                className="block h-full bg-[#0F6E56]"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.2 }}
              />
            </motion.div>
            <p className="mt-6 font-mono text-[0.65rem] tracking-[0.12em] text-[#0F6E56]">{s.n}</p>
            <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-semibold text-[#042C53] tracking-tight">{s.title}</h3>
            <p className="mt-4 text-sm md:text-base text-[#444441] leading-relaxed">{s.body}</p>
          </Item>
        ))}
      </StaggerGroup>
    </div>
  </section>
);

const checks = [
  { icon: GitMerge, label: "Scheduled reconciliations" },
  { icon: ScanSearch, label: "Duplicate supplier & back-dated entry flags" },
  { icon: Gauge, label: "VAT-to-ledger tie-outs" },
  { icon: Bot, label: "Owner dashboards showing exceptions only" },
];

export const Automation = () => (
  <section id="automation" data-testid="ai-dark-callout" className="relative bg-[#042C53] text-white overflow-hidden">
    <img src={images.nightRoads} alt="Dubai at night" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity" />
    <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_20%,rgba(15,110,86,0.45),transparent_70%)]" />
    <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-36 grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7">
        <SectionHeader
          light
          eyebrow="Controls and automation"
          title="Software runs the routine checks. I make the judgement calls."
          intro="I connect to the software you already use and build a checking layer around it. Only the exceptions reach a person."
        />
        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-2">
          {["ERPNext", "Tally", "SAGE", "Power BI", "Claude AI"].map((t) => (
            <span key={t} data-testid={`automation-badge-${t.toLowerCase().replace(/\s/g, "-")}`} className="px-4 py-2 rounded-full border border-[#85B7EB]/40 text-[#E1F5EE] font-mono text-[0.65rem] tracking-[0.08em] uppercase hover:bg-[#0F6E56] hover:border-[#0F6E56] transition-colors duration-300">
              {t}
            </span>
          ))}
        </Reveal>
      </div>
      <StaggerGroup className="lg:col-span-5 grid gap-3" delay={0.1}>
        {checks.map(({ icon: Icon, label }, i) => (
          <Item key={label} data-testid={`automation-check-${i + 1}`} className="glass-dark border border-[#85B7EB]/20 rounded-2xl px-6 py-5 flex items-center gap-5 hover:border-[#0F6E56] transition-colors duration-300">
            <span className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center shrink-0">
              <Icon size={18} />
            </span>
            <span className="text-sm md:text-base text-[#E1F5EE]">{label}</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#85B7EB] animate-pulse" />
          </Item>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
