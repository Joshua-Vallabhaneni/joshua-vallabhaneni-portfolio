"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import type { RefObject } from "react";

interface SectionProgressHairlineProps {
  sectionRef: RefObject<HTMLElement>;
}

export function SectionProgressHairline({ sectionRef }: SectionProgressHairlineProps) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  return (
    <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
      <div className="absolute inset-0 bg-border" />
      <motion.div
        className="absolute inset-y-0 left-0 right-0 bg-foreground/70"
        style={{ scaleX: smoothed, transformOrigin: "left" }}
      />
    </div>
  );
}
