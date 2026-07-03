"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "left",
      }}
      className="absolute bottom-0 left-0 right-0 h-px bg-foreground/30"
    />
  );
}
