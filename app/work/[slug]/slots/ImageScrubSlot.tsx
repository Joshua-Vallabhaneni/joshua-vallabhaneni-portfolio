"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Slot } from "@/lib/case-studies";
import { useMediaQueryLive } from "@/lib/hooks/useMediaQueryLive";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface ImageScrubSlotProps {
  slot: Extract<Slot, { type: "imageScrub" }>;
}

export function ImageScrubSlot({ slot }: ImageScrubSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const coarsePointer = useMediaQueryLive("(pointer: coarse)");
  const reducedMotion = useReducedMotion();
  const [shortViewport, setShortViewport] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const check = () => setShortViewport(window.innerHeight < 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const useScrub = !coarsePointer && !reducedMotion && !shortViewport;

  useEffect(() => {
    if (!useScrub) return;
    const trigger = ref.current;
    const target = imageContainerRef.current;
    const overlay = overlayRef.current;
    if (!trigger || !target || !overlay) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const fontFaceSet = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (fontFaceSet) {
        await fontFaceSet.ready;
      }
      if (!imageLoaded) {
        await new Promise<void>((resolve) => {
          const id = window.setInterval(() => {
            if (imageLoaded) {
              window.clearInterval(id);
              resolve();
            }
          }, 100);
          window.setTimeout(() => {
            window.clearInterval(id);
            resolve();
          }, 3000);
        });
      }
      if (cancelled) return;

      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.set(target, { scale: 0.92, transformOrigin: "center" });
        gsap.set(overlay, { opacity: 0.35 });
        ScrollTrigger.create({
          trigger,
          start: "top top+=80",
          end: "+=600",
          pin: true,
          scrub: 0.5,
          animation: gsap
            .timeline()
            .to(target, { scale: 1, ease: "none" }, 0)
            .to(overlay, { opacity: 0, ease: "none" }, 0),
        });
        ScrollTrigger.refresh();
      }, ref);

      let resizeTimer: number | undefined;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.clearTimeout(resizeTimer);
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [useScrub, imageLoaded]);

  if (!useScrub) {
    return (
      <section className="container-editorial py-16 md:py-24">
        <motion.div
          className="relative w-full overflow-hidden rounded-md border border-border bg-muted"
          style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={slot.src}
            alt={slot.alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        </motion.div>
      </section>
    );
  }

  return (
    <section ref={ref} className="container-editorial py-16 md:py-24">
      <div
        ref={imageContainerRef}
        className="relative w-full overflow-hidden rounded-md border border-border bg-muted will-change-transform"
        style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
      >
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <div
          ref={overlayRef}
          aria-hidden
          className="absolute inset-0 bg-background pointer-events-none"
        />
      </div>
    </section>
  );
}
