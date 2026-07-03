"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { NeuralGlyph } from "./NeuralGlyph";
import { smoothScrollTo } from "./motion/smoothScrollTo";
import { SplitText } from "./motion/SplitText";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden"
    >
      <NeuralGlyph className="absolute inset-0 z-0 pointer-events-none" />
      <div className="container-editorial w-full relative z-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-end">
          <div className="col-span-12 lg:col-span-9">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
              Portfolio · 2026
            </p>

            <h1 className="display text-[clamp(3rem,9vw,8.5rem)] text-foreground">
              <SplitText
                text={"Joshua\nVallabhaneni"}
                tail={<span className="text-muted-foreground">.</span>}
              />
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <p className="text-base md:text-lg leading-relaxed text-foreground/90 max-w-xl">
              Full-stack engineer and ML researcher studying CS and Data Science at the
              University of Maryland.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo("work");
                }}
                className="group inline-flex items-center gap-2 text-sm font-medium"
              >
                <span className="link-underline">Selected work</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="mailto:pjvallabhaneni@gmail.com"
                className="text-sm text-muted-foreground link-underline-reveal"
              >
                pjvallabhaneni@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14 hairline pt-5 grid grid-cols-12 gap-x-6 items-center">
          <div className="col-span-6 md:col-span-3 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yourphoto.JPG-KbKEkQ2jSxTip4vML51js2jXZdb86P.jpeg"
                alt="Joshua Vallabhaneni"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="text-sm leading-tight">
              <div className="font-medium">Based in College Park</div>
              <div className="text-muted-foreground">Maryland, USA</div>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3 text-sm">
            <div className="eyebrow mb-1">Currently</div>
            <div>SWE Intern @ PayPal · ML Research @ UMD</div>
          </div>

          <div className="hidden md:block md:col-span-3 text-sm">
            <div className="eyebrow mb-1">Studying</div>
            <div>CS (ML Track) + Data Science</div>
          </div>

          <div className="hidden md:block md:col-span-3 text-sm text-right">
            <div className="eyebrow mb-1">Scroll</div>
            <div className="text-muted-foreground">Work below ↓</div>
          </div>
        </div>
      </div>
    </section>
  );
}
