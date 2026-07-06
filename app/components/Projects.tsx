"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Github,
  Youtube,
  FileText,
  Newspaper,
  ExternalLink,
  X,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface Project {
  title: string;
  blurb: string;
  description: string;
  tags: string[];
  date: string;
  id: string;
  slug?: string;
  githubLink?: string;
  youtubeLink?: string;
  award?: string | string[];
  additionalLinks?: Array<{ text: string; url: string; icon: React.ReactNode }>;
  newsLinks?: Array<{ text: string; url: string }>;
}

const projects: Project[] = [
  {
    title: "CodeShot",
    blurb: "Turns design mockups into production code with CV, RL, and agentic search.",
    description:
      "A system that converts design mockups into production-ready code. Combines CV, RL, and agent-based reasoning to explore code variants and evaluate them via a custom similarity metric. Leveraged NVIDIA H100s on CoreWeave to cut rendering time from 20 → 5 minutes, outperforming v0 and bolt by 5% in visual similarity.",
    tags: ["Python", "OpenCV", "PyTorch", "LangChain", "React", "FastAPI", "Docker"],
    date: "2025",
    award: "2nd Place — Inference-Time Compute Hackathon",
    youtubeLink: "https://www.youtube.com/watch?v=ib1SBuyamSY",
    additionalLinks: [
      {
        text: "X announcement",
        url: "https://x.com/cognition_labs/status/1896737373872103692",
        icon: <ExternalLink className="h-3.5 w-3.5" />,
      },
    ],
    id: "codeshot",
    slug: "codeshot",
  },
  {
    title: "EduPlanner",
    blurb: "AI career-scheduling engine building four-year academic roadmaps for 1,300+ students.",
    description:
      "An AI-powered career scheduling engine that creates personalized four-year academic roadmaps for over 1,300 students. The system intelligently connects coursework with extracurricular activities across different career paths and suggests alternatives when students need to adjust their plans.",
    tags: ["React", "Vite", "PostgreSQL", "OpenRouter"],
    date: "2025",
    id: "eduplanner",
    slug: "eduplanner",
  },
  {
    title: "SwitchConfigSim",
    blurb: "Enterprise-style network switch manager with parity between a CLI and a REST API.",
    description:
      "A comprehensive network switch management interface that mirrors enterprise-grade infrastructure patterns. Dual interfaces (CLI and REST API) both execute identical backend automation scripts, enabling hands-on experience with network device management workflows.",
    tags: ["Go", "Shell", "REST APIs", "OpenAPI", "Linux", "Makefile"],
    date: "2025",
    githubLink: "https://github.com/Joshua-Vallabhaneni/SwitchConfigSim",
    youtubeLink: "https://youtu.be/GsN7T22HNzc",
    id: "switchconfigsim",
    slug: "switchconfigsim",
  },
  {
    title: "QuRE",
    blurb: "Smart LLM router that sends each prompt to the most cost-effective model without losing quality.",
    description:
      "A smart routing system that optimizes LLM API usage for businesses and users. Analyzes incoming prompts, predicts response complexity and length for different LLM models, and automatically routes queries to the most cost-effective model while maintaining output quality.",
    tags: ["Python", "React", "Node.js", "FastAPI", "MongoDB"],
    date: "2024",
    award: "1st Place — AI for Change Hackathon",
    githubLink: "https://github.com/thobonato/azalea-ai-ml",
    youtubeLink: "https://www.youtube.com/watch?v=OSJig11XJxE&t=1s",
    additionalLinks: [
      {
        text: "qure.dev",
        url: "https://www.qure.dev/",
        icon: <ExternalLink className="h-3.5 w-3.5" />,
      },
    ],
    id: "qure",
  },
  {
    title: "EcoQuery",
    blurb: "Chrome extension that surfaces the environmental cost of your AI queries in real time.",
    description:
      "A Chrome extension that empowers users to make environmentally conscious decisions about their digital queries. Intercepts ChatGPT queries in real-time, analyzes environmental impact using research-backed calculations, and provides instant comparisons with Google Search alternatives.",
    tags: ["Chrome Extension", "JavaScript", "HTML/CSS"],
    date: "2024 — 2025",
    githubLink: "https://github.com/Joshua-Vallabhaneni/Eco-Query-Extension",
    additionalLinks: [
      {
        text: "Chrome Web Store",
        url: "https://chromewebstore.google.com/detail/mcbcdggkligdjpcdpijnmiknbhmcefjl?utm_source=item-share-cb",
        icon: <ExternalLink className="h-3.5 w-3.5" />,
      },
    ],
    id: "ecoquery",
  },
  {
    title: "FireSync",
    blurb: "Disaster-recovery platform matching wildfire volunteers to tasks with AI coordination.",
    description:
      "A next-generation disaster recovery platform that empowers wildfire-stricken communities to rebuild faster and smarter. Uses AI for intelligent volunteer-task matching, real-time coordination, and impact tracking.",
    tags: ["React", "Node.js", "Express", "MongoDB", "RAG"],
    date: "2024",
    githubLink: "https://github.com/Joshua-Vallabhaneni/Wildfire",
    youtubeLink: "https://www.youtube.com/watch?v=hF7xo23Fj6g",
    id: "firesync",
  },
  {
    title: "Ignite",
    blurb: "Matching platform connecting students with nonprofits via NLP mission alignment.",
    description:
      "A full-stack web app with a custom automated matching algorithm, Google/LinkedIn API integrations, NLP-based mission alignment scoring, and email automation connecting students with nonprofits.",
    tags: ["Python", "React", "Flask", "MongoDB"],
    date: "2024",
    award: "1st Place — JP Morgan Code for Good",
    githubLink: "https://github.com/Joshua-Vallabhaneni/cypress-penn-apps",
    youtubeLink: "https://youtu.be/RGob0Xzvbho?si=x9KLLtSYsgQAysC5",
    id: "ignite",
  },
  {
    title: "CypressMFA",
    blurb: "Chrome extension for 3-factor auth with liveness, face, and gesture recognition.",
    description:
      "A Chrome extension for 3-factor authentication using Python, FastAPI, and MongoDB Atlas. Real-time liveness detection, facial recognition, and dynamic hand-gesture recognition.",
    tags: ["Chrome Extension", "Python", "React", "FastAPI", "MongoDB"],
    date: "2024",
    award: "2nd Place — Best Privacy/Security Hack & Best Use of Computer Vision, PennApps XXV",
    githubLink: "https://github.com/Joshua-Vallabhaneni/cypress-penn-apps",
    youtubeLink: "https://youtu.be/RGob0Xzvbho?si=x9KLLtSYsgQAysC5",
    id: "cypressmfa",
  },
  {
    title: "SkyCast",
    blurb: "Predicts flight delays from live weather with a RandomForest model.",
    description:
      "A Flask-based application harnessing the Open-Meteo API to predict flight delays by analyzing 5 real-time weather metrics. RandomForestRegressor model built with pandas and scikit-learn.",
    tags: ["Python", "React", "Flask", "MySQL"],
    date: "2024",
    githubLink: "https://github.com/Joshua-Vallabhaneni/SkyCast",
    id: "skycast",
  },
  {
    title: "Drug Efficacy Prediction",
    blurb: "OLS regression over MySQL to model the efficacy of Tagrisso.",
    description:
      "JDBC + MySQL analysis of the efficacy of Tagrisso. OLS Multiple Linear Regression using Apache Commons Math for model training and predictive analytics.",
    tags: ["Java", "JDBC", "Apache Commons Math", "MySQL"],
    date: "2023 — 2024",
    githubLink: "https://github.com/Joshua-Vallabhaneni/EfficacyPredictionModel",
    id: "drugefficacy",
  },
  {
    title: "Vital Smart",
    blurb: "IoT in-home vitals monitor with a real-time portal and an AI advice engine.",
    description:
      "An IoT-based in-home health monitoring system measuring multiple vitals, storing results, and displaying them in real-time through a web portal and mobile app. Custom AI-based advice engine for basic health diagnostics.",
    tags: ["Arduino", "C++", "Firebase", "Twilio", "IoT"],
    date: "2021 — 2023",
    additionalLinks: [
      {
        text: "Project report",
        url: "https://drive.google.com/file/d/1Mhg4poBOvAkDqOvZpnrxnzWYlUmmDE7G/view?usp=sharing",
        icon: <FileText className="h-3.5 w-3.5" />,
      },
    ],
    id: "vitalsmart",
  },
  {
    title: "Clevr",
    blurb: "Automated peer-tutoring matchmaker that has connected 700+ users.",
    description:
      "Automated peer tutoring matchmaking software that has efficiently connected over 700 users. Employs algorithmic techniques via Google Apps Script to foster resident learning hubs hands-free.",
    tags: ["JavaScript", "Google Apps Script"],
    date: "2020 — 2023",
    githubLink: "https://github.com/Clevr-LMS",
    id: "clevr",
  },
  {
    title: "Baby Saver",
    blurb: "Hot-car alert device that detects a child and escalates temperature warnings.",
    description:
      "A device to prevent hot-car child deaths by detecting a baby in a car seat and sending automated alerts when the car's temperature crosses certain thresholds. Multi-level alert system.",
    tags: ["Arduino", "C++", "IoT"],
    date: "2018 — 2020",
    newsLinks: [
      {
        text: "Philadelphia Inquirer",
        url: "https://www.inquirer.com/life/pranavh-joshua-vallabhaneni-invented-baby-saver-hot-car-alert-device-20200819.html",
      },
      {
        text: "Fox News",
        url: "https://www.fox29.com/video/845647",
      },
    ],
    id: "babysaver",
  },
];

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const node = modalRef.current;
    const getFocusable = () =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    // Move focus into the modal.
    (getFocusable()[0] ?? node)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  const awards = project.award
    ? Array.isArray(project.award)
      ? project.award
      : [project.award]
    : [];

  return createPortal(
    <>
      <motion.div
        className="modal-backdrop bg-background/80 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
      <div className="modal-content inset-0 flex items-center justify-center px-4 md:px-8 py-6 pointer-events-none">
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          tabIndex={-1}
          className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto bg-card border border-border rounded-lg pointer-events-auto p-6 md:p-8 focus:outline-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full border border-border hover:bg-accent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"
            aria-label="Close details"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5 pr-12">
            <h2 className="text-xl font-semibold tracking-tight">{project.title}</h2>
            <div className="text-sm text-muted-foreground tabular-nums">{project.date}</div>
          </div>

          <p className="text-sm leading-relaxed text-foreground/85">
            {project.description}
          </p>

          {awards.length > 0 && (
            <div className="mt-5 space-y-1.5">
              {awards.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-1 w-1 rounded-full bg-foreground flex-shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-xs font-mono text-muted-foreground">
            {project.tags.join(" · ")}
          </p>

          <div className="mt-6 flex flex-col gap-2">
            {project.githubLink && project.githubLink !== "#" && (
              <LinkRow href={project.githubLink} icon={<Github className="h-3.5 w-3.5" />} label="GitHub" />
            )}
            {project.youtubeLink && (
              <LinkRow href={project.youtubeLink} icon={<Youtube className="h-3.5 w-3.5" />} label="Demo video" />
            )}
            {project.additionalLinks?.map((link, i) => (
              <LinkRow key={i} href={link.url} icon={link.icon} label={link.text} />
            ))}
            {project.newsLinks?.map((link, i) => (
              <LinkRow key={i} href={link.url} icon={<Newspaper className="h-3.5 w-3.5" />} label={link.text} />
            ))}
          </div>
        </motion.div>
      </div>
    </>,
    document.body
  );
}

function LinkRow({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center justify-between gap-3 text-sm border-b border-border pb-2 focus:outline-none focus-visible:text-foreground"
    >
      <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
        {label}
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  );
}

function ProjectRow({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const awards = project.award
    ? Array.isArray(project.award)
      ? project.award
      : [project.award]
    : [];

  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-medium group-hover:text-foreground transition-colors">
          {project.title}
        </span>
        <span className="flex items-baseline gap-1.5 text-sm text-muted-foreground tabular-nums whitespace-nowrap">
          {project.date}
          <ArrowUpRight className="h-3.5 w-3.5 self-center opacity-0 -translate-x-0.5 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{project.blurb}</p>
      {awards.map((a) => (
        <p key={a} className="mt-1.5 flex items-center gap-2 text-[13px] text-foreground/90">
          <span className="h-1 w-1 rounded-full bg-foreground flex-shrink-0" />
          {a}
        </p>
      ))}
    </>
  );

  const rowClass =
    "group block w-full text-left py-5 focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 rounded-sm";

  return (
    <li id={`project-${project.id}`}>
      <button type="button" onClick={() => onOpen(project)} className={rowClass}>
        {inner}
      </button>
    </li>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const handleClose = useCallback(() => setActive(null), []);

  return (
    <section id="work" className="py-12 md:py-14">
      <div className="container-editorial">
        <h2 className="eyebrow mb-2">Projects</h2>
        <ol className="divide-y divide-border">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} onOpen={setActive} />
          ))}
        </ol>
      </div>

      {active && <ProjectModal project={active} onClose={handleClose} />}
    </section>
  );
}
