import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { EASE } from "./motion";

export const Preloader = () => (
  <motion.div
    data-testid="preloader"
    className="fixed inset-0 z-[80] bg-[#042C53] flex items-center justify-center"
    initial={{ y: 0 }}
    animate={{ y: "-100%" }}
    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 1.1 }}
  >
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.05] }}
      transition={{ duration: 1.1, times: [0, 0.25, 0.8, 1], ease: EASE }}
    >
      <Logo size={64} light />
      <p className="mt-6 font-mono text-[0.62rem] tracking-[0.35em] uppercase text-[#85B7EB]">Yogesh Trivedi · CA</p>
    </motion.div>
  </motion.div>
);
