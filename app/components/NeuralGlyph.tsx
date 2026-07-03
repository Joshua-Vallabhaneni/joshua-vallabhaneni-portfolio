"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Scene } from "./neural-glyph/Scene";
import { DensityPreset } from "./neural-glyph/geometry";
import { useMediaQueryLive } from "@/lib/hooks/useMediaQueryLive";

interface NeuralGlyphProps {
  className?: string;
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return gl !== null;
  } catch {
    return false;
  }
}

function useDensity(): DensityPreset {
  const isMobile = useMediaQueryLive("(max-width: 767px)");
  const isTablet = useMediaQueryLive("(min-width: 768px) and (max-width: 1023px)");
  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
}

export function NeuralGlyph({ className }: NeuralGlyphProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [canvasMounted, setCanvasMounted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const reducedMotion = useMediaQueryLive("(prefers-reduced-motion: reduce)");
  const isCoarsePointer = useMediaQueryLive("(pointer: coarse)");
  const density = useDensity();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(detectWebGL());
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const readProgress = () => {
      const rect = el.getBoundingClientRect();
      const height = rect.height || 1;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / height);
      setScrollProgress(progress);
    };

    const startLoop = () => {
      const tick = () => {
        readProgress();
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    };

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio > 0) {
            if (hideTimerRef.current !== null) {
              window.clearTimeout(hideTimerRef.current);
              hideTimerRef.current = null;
            }
            setCanvasMounted(true);
            startLoop();
          } else {
            stopLoop();
            if (hideTimerRef.current === null) {
              hideTimerRef.current = window.setTimeout(() => {
                setCanvasMounted(false);
                hideTimerRef.current = null;
              }, 500);
            }
          }
        }
      },
      { threshold: [0, 0.01, 0.5, 1] },
    );
    observer.observe(el);
    readProgress();
    startLoop();

    return () => {
      observer.disconnect();
      stopLoop();
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || isCoarsePointer) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const handleLeave = () => setCursor(null);

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [isCoarsePointer]);

  if (!mounted || !resolvedTheme) {
    return <div ref={wrapperRef} className={className} aria-hidden="true" />;
  }

  const theme: "dark" | "light" = resolvedTheme === "dark" ? "dark" : "light";

  if (hasWebGL === false || contextLost) {
    return (
      <div ref={wrapperRef} className={className} aria-hidden="true">
        <Image
          src={`/neural-glyph-poster-${theme}.webp`}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      {canvasMounted && hasWebGL && (
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={reducedMotion ? "demand" : "always"}
          style={{ position: "absolute", inset: 0 }}
          onCreated={({ gl }) => {
            gl.domElement.setAttribute("aria-hidden", "true");
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setContextLost(true);
            });
          }}
        >
          <Scene
            scrollProgress={scrollProgress}
            cursor={cursor}
            theme={theme}
            reducedMotion={reducedMotion}
            density={density}
          />
        </Canvas>
      )}
    </div>
  );
}
