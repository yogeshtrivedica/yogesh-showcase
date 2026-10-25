import { Clock, Eye, FileText } from "lucide-react";
import { Reveal, SectionHeader } from "./motion";
import { LeadForm } from "./LeadForm";

const points = [
  { icon: Clock, text: "20 minutes. No slides, no pitch." },
  { icon: Eye, text: "If we go further, access is view-only. Nothing in your system changes." },
  { icon: FileText, text: "You get a short findings note with every exposure valued in dirhams." },
];

export const Booking = () => (
  <section id="booking" data-testid="booking-section" className="bg-[#F1EFE8] py-24 lg:py-32 border-t border-[#D3D1C7]/60">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <div className="lg:col-span-5 lg:sticky lg:top-28">
        <SectionHeader
          eyebrow="Book the first conversation"
          title="Tell me which numbers you rely on. I'll tell you where to look."
          intro="A free 20-minute call to decide whether a Financial Health Check is worth your time. Fill in the form and I will reply personally, usually within one working day."
        />
        <Reveal delay={0.15} className="mt-10 space-y-4">
          {points.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-xl bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center shrink-0">
                <Icon size={16} />
              </span>
              <p className="text-sm md:text-base text-[#444441] leading-relaxed pt-1.5">{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal delay={0.1} className="lg:col-span-7">
        <div className="bg-white rounded-3xl border border-[#D3D1C7] p-6 sm:p-10 shadow-[0_30px_60px_-40px_rgba(4,44,83,0.35)]">
          <LeadForm source="booking" />
        </div>
      </Reveal>
    </div>
  </section>
);
