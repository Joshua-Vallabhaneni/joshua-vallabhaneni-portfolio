"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { Slot } from "@/lib/case-studies";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface VideoSlotProps {
  slot: Extract<Slot, { type: "video" }>;
}

export function VideoSlot({ slot }: VideoSlotProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.4,
  });
  const scale = useTransform(smoothed, [0, 0.5, 1], [0.94, 1, 0.98]);
  const y = useTransform(smoothed, [0, 1], [40, -40]);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <section ref={sectionRef} className="container-editorial py-16 md:py-24">
      <motion.div
        ref={ref}
        className="aspect-video w-full overflow-hidden rounded-md border border-border bg-muted will-change-transform"
        style={reducedMotion ? undefined : { scale, y }}
      >
        {visible ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${slot.videoId}?rel=0&modestbranding=1`}
            title={slot.title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        ) : null}
      </motion.div>
    </section>
  );
}
