"use client";

import { motion } from "framer-motion";

interface AnimatedSectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function AnimatedSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: AnimatedSectionHeaderProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`mb-14 md:mb-20 max-w-3xl ${alignment}`}>
      {eyebrow && (
        <motion.p
          className="eyebrow mb-4"
          initial={{ y: 8 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        className="display text-4xl md:text-6xl lg:text-7xl text-foreground"
        initial={{ y: 12 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl"
          initial={{ y: 8 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
