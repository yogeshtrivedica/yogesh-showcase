import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { results, career, credentials } from "@/data/profile";
import { SectionHeader, StaggerGroup, Item, Reveal, EASE } from "./motion";

export const Results = () => (
  <section id="results" data-testid="results-section" className="bg-[#F1EFE8] py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
      <SectionHeader
        eyebrow="Results from inside operating businesses"
        title="Numbers I have changed while working inside these businesses."
      />
      <StaggerGroup className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.1}>
        {results.map((r, i) => (
          <Item key={r.value}>
            <motion.article
              data-testid={`result-card-${i + 1}`}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="h-full bg-white rounded-3xl border border-[#D3D1C7] hover:border-[#0F6E56] p-8 flex flex-col"
            >
              <p className="font-serif text-3xl sm:text-4xl font-semibold text-[#042C53] tracking-tight leading-none">{r.value}</p>
              <p className="mt-5 text-sm md:text-base text-[#444441] leading-relaxed flex-1">{r.body}</p>
              <p className="mt-6 flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[#0F6E56]">
                <MapPin size={12} /> {r.place}
              </p>
            </motion.article>
          </Item>
        ))}
      </StaggerGroup>
    </div>
  </section>
);

export const Career = () => (
  <section id="career" data-testid="career-section" className="bg-[#F8F7F4] py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
        <SectionHeader eyebrow="Career" title="17 years in finance across the UAE, East Africa and India." />
      </div>
      <div className="lg:col-span-8">
        <StaggerGroup className="relative border-l border-[#D3D1C7]" delay={0.08}>
          {career.map((c, i) => (
            <Item
              key={c.years}
              data-testid={`timeline-item-${c.years.slice(0, 4)}`}
              className="group relative pl-10 py-6 grid sm:grid-cols-[150px_1fr] gap-2 sm:gap-8 border-b border-[#D3D1C7]/60 last:border-b-0 hover:bg-white/60 transition-colors duration-300 rounded-r-2xl"
            >
              <span
                className={`absolute -left-[5px] top-8 w-[9px] h-[9px] rounded-full border-2 border-[#F8F7F4] ${
                  c.current ? "bg-[#0F6E56] ring-4 ring-[#E1F5EE]" : "bg-[#D3D1C7] group-hover:bg-[#042C53]"
                } transition-colors duration-300`}
              />
              <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#5F5E5A] pt-1">{c.years}</span>
              <div>
                <p className={`font-serif text-xl sm:text-2xl font-semibold tracking-tight ${c.current ? "text-[#0F6E56]" : "text-[#042C53]"}`}>{c.role}</p>
                <p className="mt-1 text-sm text-[#444441]">{c.detail}</p>
              </div>
            </Item>
          ))}
        </StaggerGroup>
      </div>
    </div>
  </section>
);

const Pills = ({ items, testid, accent }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((it) => (
      <span
        key={it}
        data-testid={`${testid}-${it.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        className={`px-4 py-2 rounded-full text-sm border transition-colors duration-300 ${
          accent ? "bg-[#E1F5EE] border-[#E1F5EE] text-[#042C53] hover:bg-[#0F6E56] hover:text-white" : "bg-white border-[#D3D1C7] text-[#2C2C2A] hover:border-[#042C53]"
        }`}
      >
        {it}
      </span>
    ))}
  </div>
);

export const Credentials = () => (
  <section id="credentials" data-testid="credentials-section" className="bg-[#F8F7F4] pb-24 lg:pb-32">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
      <div className="rule mb-16" />
      <StaggerGroup className="grid md:grid-cols-3 gap-10" delay={0.12}>
        <Item>
          <p className="eyebrow mb-5">Credentials</p>
          <Pills items={credentials.qualifications} testid="credential" />
        </Item>
        <Item>
          <p className="eyebrow mb-5">Tools</p>
          <Pills items={credentials.tools} testid="tool" accent />
        </Item>
        <Item>
          <p className="eyebrow mb-5">Languages</p>
          <Pills items={credentials.languages} testid="language" />
        </Item>
      </StaggerGroup>
    </div>
  </section>
);
