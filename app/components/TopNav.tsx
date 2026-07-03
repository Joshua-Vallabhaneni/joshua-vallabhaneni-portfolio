"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { smoothScrollTo } from "./motion/smoothScrollTo";
import { ScrollProgress } from "./motion/ScrollProgress";

const sections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function TopNav() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", ...sections.map((s) => s.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-background/70 border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="container-editorial flex items-center justify-between h-16">
        <Link
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("hero");
          }}
          aria-label="Back to top"
          className="text-sm font-medium tracking-tight inline-flex items-center justify-center w-6 h-6"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo(s.id);
              }}
              className={`text-sm transition-colors ${
                active === s.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <a
          href="mailto:pjvallabhaneni@gmail.com"
          className="text-sm font-medium link-underline hidden sm:inline-block"
        >
          Get in touch
        </a>
      </div>
      <ScrollProgress />
    </header>
  );
}
