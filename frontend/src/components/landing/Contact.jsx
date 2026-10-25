import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Phone, Linkedin, ArrowUpRight } from "lucide-react";
import { profile, images } from "@/data/profile";
import { Reveal, EASE } from "./motion";
import { Logo } from "./Logo";

export const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative bg-[#042C53] text-white overflow-hidden">
      <img src={images.marina} alt="Dubai Marina" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 mix-blend-luminosity hidden lg:block" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#042C53] via-[#042C53] to-[#042C53]/40" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-40">
        <Reveal>
          <p className="eyebrow !text-[#85B7EB] mb-6">Start with a Financial Health Check</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] tracking-tight max-w-3xl">
            I review your data without changing anything in your system.
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg text-[#B5D4F4] leading-relaxed">
            You get a short, prioritised findings note with every exposure valued in dirhams. Then you decide. The first 20-minute conversation costs nothing.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 grid sm:grid-cols-3 gap-4 max-w-4xl">
          <motion.button
            data-testid="footer-email-button"
            onClick={copyEmail}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="group text-left glass-dark border border-[#85B7EB]/25 hover:border-[#0F6E56] rounded-2xl p-6 transition-colors duration-300"
          >
            <span className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </span>
            <p className="mt-5 font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[#85B7EB]">{copied ? "Copied" : "Email"}</p>
            <p className="mt-2 text-sm sm:text-base break-all text-[#E1F5EE]">{profile.email}</p>
          </motion.button>

          <motion.a
            data-testid="footer-phone-link"
            href={profile.phoneHref}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass-dark border border-[#85B7EB]/25 hover:border-[#0F6E56] rounded-2xl p-6 transition-colors duration-300"
          >
            <span className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center">
              <Phone size={18} />
            </span>
            <p className="mt-5 font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[#85B7EB]">Phone · WhatsApp</p>
            <p className="mt-2 text-sm sm:text-base text-[#E1F5EE]">{profile.phone}</p>
          </motion.a>

          <motion.a
            data-testid="footer-linkedin-link"
            href={profile.linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass-dark border border-[#85B7EB]/25 hover:border-[#0F6E56] rounded-2xl p-6 transition-colors duration-300"
          >
            <span className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center">
              <Linkedin size={18} />
            </span>
            <p className="mt-5 font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[#85B7EB]">LinkedIn</p>
            <p className="mt-2 text-sm sm:text-base text-[#E1F5EE] flex items-center gap-1">
              cayogeshtrivedi <ArrowUpRight size={14} />
            </p>
          </motion.a>
        </Reveal>
      </div>

      <footer data-testid="site-footer" className="relative border-t border-[#85B7EB]/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={28} light />
            <span className="font-serif text-base text-[#E1F5EE]">{profile.name}</span>
          </div>
          <p className="font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[#85B7EB]">
            Dubai · UAE · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </section>
  );
};
