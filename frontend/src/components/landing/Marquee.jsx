import { marqueeItems } from "@/data/profile";

export const Marquee = () => {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div data-testid="marquee-ribbon" className="marquee bg-[#042C53] text-[#E1F5EE] py-4 overflow-hidden border-y border-[#0A3966]">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8 pr-8 font-mono text-[0.7rem] tracking-[0.1em] uppercase whitespace-nowrap">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56]" />
          </span>
        ))}
      </div>
    </div>
  );
};
