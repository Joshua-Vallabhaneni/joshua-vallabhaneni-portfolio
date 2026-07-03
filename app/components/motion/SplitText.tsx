"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface SplitTextProps {
  text: string;
  stagger?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
  tail?: ReactNode;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function renderPlain(text: string, tail?: ReactNode) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
      {tail}
    </>
  );
}

export function SplitText({
  text,
  stagger = 14,
  duration = 700,
  y = 12,
  once = true,
  className,
  tail,
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const [fontsReady, setFontsReady] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.4 });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const fontFaceSet = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fontFaceSet) {
      setFontsReady(true);
      return;
    }
    let cancelled = false;
    fontFaceSet.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reducedMotion || !fontsReady) {
    return (
      <span ref={ref} className={className}>
        {renderPlain(text, tail)}
      </span>
    );
  }

  const lines = text.split("\n");
  const child: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration / 1000, ease: EASE },
    },
  };
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger / 1000 } },
  };

  return (
    <span ref={ref} aria-label={text} className={className}>
      <motion.span
        style={{ display: "inline" }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={container}
      >
        {lines.flatMap((line, lineIdx) => {
          const words = line.split(" ");
          const isLastLine = lineIdx === lines.length - 1;
          const nodes: ReactNode[] = [];
          words.forEach((word, wordIdx) => {
            const isLastWordOfLast = isLastLine && wordIdx === words.length - 1;
            nodes.push(
              <span
                key={`l${lineIdx}-w${wordIdx}`}
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
              >
                {Array.from(word).map((ch, i) => (
                  <motion.span
                    key={`l${lineIdx}-w${wordIdx}-c${i}`}
                    aria-hidden
                    variants={child}
                    style={{ display: "inline-block", willChange: "transform, opacity" }}
                  >
                    {ch}
                  </motion.span>
                ))}
                {isLastWordOfLast && tail}
              </span>
            );
            if (wordIdx < words.length - 1) {
              nodes.push(<span key={`l${lineIdx}-w${wordIdx}-sp`}>{"\u00A0"}</span>);
            }
          });
          if (lineIdx < lines.length - 1) {
            nodes.push(<br key={`br-${lineIdx}`} aria-hidden />);
          }
          return nodes;
        })}
      </motion.span>
    </span>
  );
}
