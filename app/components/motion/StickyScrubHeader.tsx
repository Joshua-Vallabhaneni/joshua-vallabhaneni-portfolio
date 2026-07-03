"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type RefObject } from "react";
import { SplitText } from "./SplitText";

interface StickyScrubHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  sectionRef: RefObject<HTMLElement>;
}

export function StickyScrubHeader({
  eyebrow,
  title,
  subtitle,
  sectionRef,
}: StickyScrubHeaderProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  const smoothed = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const titleY = useTransform(smoothed, [0, 1], [12, -12]);
  const titleOpacity = useTransform(smoothed, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={innerRef} className="md:sticky md:top-24 self-start">
      {eyebrow && (
        <motion.p
          className="eyebrow mb-4 flex items-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            aria-hidden
            style={{ scaleX: smoothed, transformOrigin: "left" }}
            className="block h-px w-8 bg-foreground/60"
          />
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        className="display text-4xl md:text-6xl lg:text-7xl text-foreground"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        <SplitText text={title} stagger={20} duration={650} />
      </motion.h2>

      {subtitle && (
        <motion.p
          className="mt-5 text-base md:text-lg text-muted-foreground max-w-md"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
