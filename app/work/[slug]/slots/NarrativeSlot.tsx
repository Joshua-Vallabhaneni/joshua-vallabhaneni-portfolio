"use client";

import { motion } from "framer-motion";
import type { Slot } from "@/lib/case-studies";

interface NarrativeSlotProps {
  slot: Extract<Slot, { type: "narrative" }>;
}

export function NarrativeSlot({ slot }: NarrativeSlotProps) {
  return (
    <section className="container-editorial py-16 md:py-24 hairline">
      <div className="max-w-2xl space-y-6">
        {slot.paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            className="text-base md:text-lg leading-relaxed text-foreground/90"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
