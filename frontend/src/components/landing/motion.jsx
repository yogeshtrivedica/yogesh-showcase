import { motion } from "framer-motion";

export const EASE = [0.215, 0.61, 0.355, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

export const Reveal = ({ children, className = "", delay = 0, ...rest }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    variants={{
      hidden: { opacity: 0, y: 36 },
      show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } },
    }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const StaggerGroup = ({ children, className = "", delay = 0.1, ...rest }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    variants={stagger(delay)}
    {...rest}
  >
    {children}
  </motion.div>
);

export const Item = ({ children, className = "", ...rest }) => (
  <motion.div className={className} variants={fadeUp} {...rest}>
    {children}
  </motion.div>
);

/* word-by-word masked reveal for headings */
export const MaskedLines = ({ lines, className = "", delay = 0.3, lineClass = "" }) => (
  <span className={className}>
    {lines.map((line, i) => (
      <span key={line} className="block overflow-hidden pb-[0.08em]">
        <motion.span
          className={`block ${lineClass}`}
          initial={{ y: "110%", rotate: 2 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: EASE, delay: delay + i * 0.12 }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);

export const SectionHeader = ({ eyebrow, title, intro, align = "left", light = false }) => (
  <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    <p className={`eyebrow mb-5 ${light ? "text-[#85B7EB]" : ""}`}>{eyebrow}</p>
    <h2
      className={`font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight font-semibold ${
        light ? "text-white" : "text-[#042C53]"
      }`}
    >
      {title}
    </h2>
    {intro && (
      <p className={`mt-6 text-base md:text-lg leading-relaxed ${light ? "text-[#B5D4F4]" : "text-[#444441]"}`}>
        {intro}
      </p>
    )}
  </Reveal>
);
