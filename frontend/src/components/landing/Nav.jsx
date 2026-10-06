import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { EASE } from "./motion";
import { scrollToId } from "@/hooks/useLenis";

const links = [
  { id: "problems", label: "Services" },
  { id: "process", label: "How I work" },
  { id: "results", label: "Results" },
  { id: "career", label: "Career" },
  { id: "contact", label: "Contact" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      data-testid="site-nav"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        scrolled ? "glass border-b border-[#D3D1C7]/70 shadow-[0_10px_30px_-20px_rgba(4,44,83,0.35)]" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-[72px] flex items-center justify-between">
        <button
          data-testid="nav-brand-logo"
          onClick={() => window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group"
        >
          <Logo size={36} className="transition-transform duration-500 group-hover:rotate-[-6deg]" />
          <span className="hidden sm:block text-left leading-tight">
            <span className="block font-serif text-lg font-semibold text-[#042C53]">Yogesh Trivedi</span>
            <span className="block font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#0F6E56]">CA · Fractional CFO</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="relative text-sm font-medium text-[#444441] hover:text-[#042C53] transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[#0F6E56] after:transition-[width] after:duration-300 hover:after:w-full"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button data-testid="nav-health-check-cta" onClick={() => go("contact")} className="btn-pill btn-navy !py-2.5 !px-5 text-xs sm:text-sm">
            Book a Health Check
          </button>
          <button
            data-testid="nav-mobile-toggle"
            className="md:hidden p-2 text-[#042C53]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="nav-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="md:hidden overflow-hidden glass border-t border-[#D3D1C7]/70"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((l) => (
                <button key={l.id} onClick={() => go(l.id)} className="text-left font-serif text-2xl text-[#042C53]">
                  {l.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
