"use client";

import { motion } from "framer-motion";
import type { Slot } from "@/lib/case-studies";
import { SplitText } from "@/app/components/motion/SplitText";

interface HeroSlotProps {
  slot: Extract<Slot, { type: "hero" }>;
}

export function HeroSlot({ slot }: HeroSlotProps) {
  return (
    <section className="container-editorial py-16 md:py-24">
      <p className="eyebrow mb-6">{slot.eyebrow}</p>
      <h1 className="display text-[clamp(2.75rem,8vw,7rem)] text-foreground mb-10">
        <SplitText text={slot.title} />
      </h1>
      <motion.p
        className="text-lg md:text-xl leading-relaxed text-foreground/90 max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {slot.summary}
      </motion.p>
      <motion.div
        className="mt-10 flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {slot.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
