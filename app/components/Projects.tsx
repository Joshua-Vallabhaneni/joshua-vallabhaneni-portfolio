"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Github, Youtube, FileText, Newspaper, Twitter, ExternalLink, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSectionHeader from "./AnimatedSectionHeader";
import { SectionProgressHairline } from "./motion/SectionProgressHairline";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  githubLink: string;
  youtubeLink?: string;
  tags: string[];
  date: string;
  award?: string | string[];
  additionalLinks?: Array<{ text: string; url: string; icon: React.ReactNode }>;
  newsLinks?: Array<{ text: string; url: string }>;
  id: string;
  index: number;
}

function ProjectCard({
  title,
  description,
  image,
  githubLink,
  youtubeLink,
  tags,
  date,
  award,
  additionalLinks,
  newsLinks,
  id,
  index,
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isExpanded]);

  useEffect(() => {
    document.body.style.overflow = isExpanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  const indexLabel = String(index + 1).padStart(2, "0");

  const cardChrome = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-md">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-border/60 rounded-md pointer-events-none" />
        {award && (
          <div className="absolute top-3 right-3">
            <span className="inline-block rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-white backdrop-blur-sm">
              Award
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/5 transition-colors duration-500" />
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span>View</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-medium text-foreground truncate">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {tags.slice(0, 3).join(" · ")}
          </p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap mt-1">{date}</span>
      </div>
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] as const },
    className: "group block w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 rounded-sm",
    id: `project-${id}`,
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsExpanded(true)}
        {...motionProps}
      >
        {cardChrome}
      </motion.button>

      {isExpanded &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            <motion.div
              className="modal-backdrop bg-background/80 backdrop-blur-md"
              onClick={() => setIsExpanded(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <div className="modal-content inset-0 flex items-center justify-center px-4 md:px-8 py-6 pointer-events-none">
            <motion.div
              ref={modalRef}
              className="relative w-full max-w-5xl max-h-[88vh] overflow-y-auto bg-card border border-border rounded-lg pointer-events-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden">
                <Image src={image} alt={title} fill sizes="100vw" className="object-cover" />
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-background transition-colors"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
                  <div>
                    <p className="eyebrow mb-2">Project · {indexLabel}</p>
                    <h2 className="display text-3xl md:text-5xl text-foreground">{title}</h2>
                  </div>
                  <div className="text-sm text-muted-foreground">{date}</div>
                </div>

                <div className="grid md:grid-cols-5 gap-8 md:gap-12">
                  <div className="md:col-span-3">
                    <p className="text-base leading-relaxed text-foreground/90">{description}</p>

                    {award && (
                      <div className="mt-6 space-y-2">
                        {(Array.isArray(award) ? award : [award]).map((a, i) => (
                          <div key={i} className="inline-flex items-center gap-2 text-sm font-medium border border-border px-3 py-1 rounded-full mr-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                            {a}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <div className="eyebrow mb-3">Stack</div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="eyebrow mb-3">Links</div>
                      <div className="flex flex-col gap-2">
                        {githubLink !== "#" && (
                          <Link
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-between gap-3 text-sm border-b border-border pb-2"
                          >
                            <span className="flex items-center gap-2">
                              <Github className="h-3.5 w-3.5" />
                              GitHub
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </Link>
                        )}
                        {youtubeLink && (
                          <Link
                            href={youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-between gap-3 text-sm border-b border-border pb-2"
                          >
                            <span className="flex items-center gap-2">
                              <Youtube className="h-3.5 w-3.5" />
                              Demo video
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </Link>
                        )}
                        {additionalLinks?.map((link, i) => (
                          <Link
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-between gap-3 text-sm border-b border-border pb-2"
                          >
                            <span className="flex items-center gap-2">{link.icon}{link.text}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </Link>
                        ))}
                        {newsLinks?.map((link, i) => (
                          <Link
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-between gap-3 text-sm border-b border-border pb-2"
                          >
                            <span className="flex items-center gap-2">
                              <Newspaper className="h-3.5 w-3.5" />
                              {link.text}
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const projects = [
    {
      title: "EduPlanner",
      description:
        "An AI-powered career scheduling engine that creates personalized four-year academic roadmaps for over 1,300 students. The system intelligently connects coursework with extracurricular activities across different career paths and suggests alternatives when students need to adjust their plans.",
      image: "/eduplanner.png",
      githubLink: "#",
      tags: ["React", "Vite", "PostgreSQL", "OpenRouter"],
      date: "2025",
      id: "eduplanner",
    },
    {
      title: "SwitchConfigSim",
      description:
        "A comprehensive network switch management interface that mirrors enterprise-grade infrastructure patterns. Dual interfaces (CLI and REST API) both execute identical backend automation scripts, enabling hands-on experience with network device management workflows.",
      image: "/switchconfig.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/SwitchConfigSim",
      youtubeLink: "https://youtu.be/GsN7T22HNzc",
      tags: ["Go", "Shell", "REST APIs", "OpenAPI", "Linux", "Makefile"],
      date: "2025",
      id: "switchconfigsim",
    },
    {
      title: "EcoQuery",
      description:
        "A Chrome extension that empowers users to make environmentally conscious decisions about their digital queries. Intercepts ChatGPT queries in real-time, analyzes environmental impact using research-backed calculations, and provides instant comparisons with Google Search alternatives.",
      image: "/ecoquery.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/Eco-Query-Extension",
      tags: ["Chrome Extension", "JavaScript", "HTML/CSS"],
      date: "2024 – 2025",
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
      title: "CodeShot",
      description:
        "A system that converts design mockups into production-ready code. Combines CV, RL, and agent-based reasoning to explore code variants and evaluate them via a custom similarity metric. Leveraged NVIDIA H100s on CoreWeave to cut rendering time from 20 → 5 minutes, outperforming v0 and bolt by 5% in visual similarity.",
      image: "/codeshot.png",
      githubLink: "#",
      tags: ["Python", "OpenCV", "PyTorch", "LangChain", "React", "FastAPI", "Docker"],
      date: "2025",
      award: "2nd Place — Inference-Time Compute Hackathon",
      additionalLinks: [
        {
          text: "X announcement",
          url: "https://x.com/cognition_labs/status/1896737373872103692",
          icon: <Twitter className="h-3.5 w-3.5" />,
        },
      ],
      youtubeLink: "https://www.youtube.com/watch?v=ib1SBuyamSY",
      id: "codeshot",
    },
    {
      title: "QuRE",
      description:
        "A smart routing system that optimizes LLM API usage for businesses and users. Analyzes incoming prompts, predicts response complexity and length for different LLM models, and automatically routes queries to the most cost-effective model while maintaining output quality.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7sb4ZVKsvMCha6Os6Dcs0iym0CG6NG.png",
      githubLink: "https://github.com/thobonato/azalea-ai-ml",
      youtubeLink: "https://www.youtube.com/watch?v=OSJig11XJxE&t=1s",
      tags: ["Python", "React", "Node.js", "FastAPI", "MongoDB"],
      date: "2024",
      award: "1st Place — AI for Change Hackathon",
      id: "qure",
      additionalLinks: [
        {
          text: "qure.dev",
          url: "https://www.qure.dev/",
          icon: <ExternalLink className="h-3.5 w-3.5" />,
        },
      ],
    },
    {
      title: "FireSync",
      description:
        "A next-generation disaster recovery platform that empowers wildfire-stricken communities to rebuild faster and smarter. Uses AI for intelligent volunteer-task matching, real-time coordination, and impact tracking.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/firesync-jb0vNaeaWJxdwrGgKcOLTvbTKixDl7.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/Wildfire",
      youtubeLink: "https://www.youtube.com/watch?v=hF7xo23Fj6g",
      tags: ["React", "Node.js", "Express", "MongoDB", "RAG"],
      date: "2024",
      id: "firesync",
    },
    {
      title: "Ignite",
      description:
        "A full-stack web app with a custom automated matching algorithm, Google/LinkedIn API integrations, NLP-based mission alignment scoring, and email automation connecting students with nonprofits.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0EVZVGMPSbFomDLwGqMNH83zaCbJ7B.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/cypress-penn-apps",
      youtubeLink: "https://youtu.be/RGob0Xzvbho?si=x9KLLtSYsgQAysC5",
      tags: ["Python", "React", "Flask", "MongoDB"],
      date: "2024",
      award: "1st Place — JP Morgan Code for Good",
      id: "ignite",
    },
    {
      title: "CypressMFA",
      description:
        "A Chrome extension for 3-factor authentication using Python, FastAPI, and MongoDB Atlas. Real-time liveness detection, facial recognition, and dynamic hand-gesture recognition.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cypress-P2aTSvrBkHcdQRhE2cR3V0zMDUyEVn.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/cypress-penn-apps",
      youtubeLink: "https://youtu.be/RGob0Xzvbho?si=x9KLLtSYsgQAysC5",
      tags: ["Chrome Extension", "Python", "React", "FastAPI", "MongoDB"],
      date: "2024",
      award: [
        "2nd Place — Best Privacy/Security Hack, PennApps XXV",
        "2nd Place — Best Use of Computer Vision, PennApps XXV",
      ],
      id: "cypressmfa",
    },
    {
      title: "SkyCast",
      description:
        "A Flask-based application harnessing the Open-Meteo API to predict flight delays by analyzing 5 real-time weather metrics. RandomForestRegressor model built with pandas and scikit-learn.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SkyCast-CmhbsjfuZMGgH7SAQsK2Mv0eKVWUEy.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/SkyCast",
      tags: ["Python", "React", "Flask", "MySQL"],
      date: "2024",
      id: "skycast",
    },
    {
      title: "Drug Efficacy Prediction",
      description:
        "JDBC + MySQL analysis of the efficacy of Tagrisso. OLS Multiple Linear Regression using Apache Commons Math for model training and predictive analytics.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drugefficacy-pJJYtJobIHkdTFrWyjUz4qeYBFRzE8.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/EfficacyPredictionModel",
      tags: ["Java", "JDBC", "Apache Commons Math", "MySQL"],
      date: "2023 – 2024",
      id: "drugefficacy",
    },
    {
      title: "Vital Smart",
      description:
        "An IoT-based in-home health monitoring system measuring multiple vitals, storing results, and displaying them in real-time through a web portal and mobile app. Custom AI-based advice engine for basic health diagnostics.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VitalSmart-4s5ZxC4I9d3apCVHNKHE53Pwe5Q3aW.png",
      githubLink: "#",
      tags: ["Arduino", "C++", "Firebase", "Twilio", "IoT"],
      date: "2021 – 2023",
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
      description:
        "Automated peer tutoring matchmaking software that has efficiently connected over 700 users. Employs algorithmic techniques via Google Apps Script to foster resident learning hubs hands-free.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clevr-1nwpq68nsaOGstF6YEasuJyfc58eTu.png",
      githubLink: "https://github.com/Clevr-LMS",
      tags: ["JavaScript", "Google Apps Script"],
      date: "2020 – 2023",
      id: "clevr",
    },
    {
      title: "Baby Saver",
      description:
        "A device to prevent hot-car child deaths by detecting a baby in a car seat and sending automated alerts when the car's temperature crosses certain thresholds. Multi-level alert system.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/babysaver-GWpcK23wCCzoNBJXDHzXCfppxTOc6L.png",
      githubLink: "#",
      tags: ["Arduino", "C++", "IoT"],
      date: "2018 – 2020",
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

  return (
    <section ref={sectionRef} id="work" className="relative py-24 md:py-40">
      <SectionProgressHairline sectionRef={sectionRef} />
      <div className="container-editorial">
        <AnimatedSectionHeader
          eyebrow="Selected work"
          title="Things I've built."
        />
      </div>
      <div className="mt-4 md:mt-8 overflow-x-auto snap-x snap-mandatory scroll-px-6 md:scroll-px-12 px-6 md:px-12 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-x-6 md:gap-x-8">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="snap-start flex-none w-[82%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]"
            >
              <ProjectCard {...project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
