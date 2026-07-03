"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { StickyScrubHeader } from "./motion/StickyScrubHeader";
import { SectionProgressHairline } from "./motion/SectionProgressHairline";

interface ExperienceItem {
  company: string;
  location: string;
  period: string;
  role: string;
  logos?: Array<{ src: string; alt: string }>;
  responsibilities: string[];
  id: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "Amazon",
    location: "",
    period: "Sep 2026 — Nov 2026",
    role: "Incoming Software Engineer Intern",
    logos: [{ src: "/amazon.png", alt: "Amazon" }],
    id: "amazon",
    responsibilities: [],
  },
  {
    company: "Oracle",
    location: "",
    period: "May 2026 — Aug 2026",
    role: "Software Engineer Intern",
    logos: [{ src: "/oracle.png", alt: "Oracle" }],
    id: "oracle",
    responsibilities: ["Working on the Retail AI Service Team."],
  },
  {
    company: "PayPal",
    location: "San Jose, CA",
    period: "May — Aug 2025",
    role: "Software Engineer Intern",
    logos: [{ src: "/paypal.png", alt: "PayPal" }],
    id: "paypal",
    responsibilities: [
      "Engineered an E2E integration pipeline (JGit, Picocli, GPT-4) in PayPal's CI workflow, automating dev infra setup.",
      "Deployed GitHub API / Jenkins workflow for PR automation, slashing dev onboarding from 3 days to 5 minutes.",
      "Shipped a RAG pipeline (Graph API + OpenAI Whisper + LanceDB) that answers questions about internal docs and SharePoint videos in under 2s via a Next.js chatbot.",
    ],
  },
  {
    company: "AstraZeneca · Evinova",
    location: "Gaithersburg, MD",
    period: "May 2024 — May 2025",
    role: "Junior Software Engineer (Full-Time)",
    logos: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AstraZeneca-zvEnjvcVUwFD6fzwItgByRWDbh70GK.png",
        alt: "AstraZeneca",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Evinova-6JYlVrQKeOK73BzmorJD2tyl1ABSMY.png",
        alt: "Evinova",
      },
    ],
    id: "astrazeneca",
    responsibilities: [
      "Worked 40 hr/wk as a full-time student at Evinova, AstraZeneca's health-tech subsidiary.",
      "Led development of a production health analytics platform (Vite, React, Storybook) with a real-time patient monitoring interface built in D3.js and Motion.",
      "Streamlined time-series processing, PCA and signal analysis with Pandas, NumPy, and SciPy.",
      "Devised binary / multiclass classifiers using k-fold CV and confusion matrices to tune thresholds.",
    ],
  },
  {
    company: "CATS2",
    location: "Sunnyvale, CA",
    period: "May — Aug 2024",
    role: "Human-Computer Interaction Intern",
    logos: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CATS2-34rTJBy4GZxzJxcXnDZOutCathbk2N.png",
        alt: "CATS2",
      },
    ],
    id: "cats2",
    responsibilities: [
      "Conducted user testing sessions to enhance OWL app usability.",
      "Developed feedback questionnaires to gather actionable insights.",
      "Produced reports on findings by applying UX design heuristics.",
    ],
  },
  {
    company: "Proxzar.AI",
    location: "East Brunswick, NJ",
    period: "Jun — Aug 2022",
    role: "Software Engineer Intern",
    logos: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proxzar-PWgXWn1QGHwoj2dyNwCAg9VF3fF4c3.png",
        alt: "Proxzar",
      },
    ],
    id: "proxzar",
    responsibilities: [
      "Engineered a React UI with Transformer NLP for intent / entity extraction, boosting throughput.",
      "Deployed 5 semantic-search interfaces with contextual embeddings and dynamic ranking.",
    ],
  },
  {
    company: "United Safety & Survivability Corp.",
    location: "Exton, PA",
    period: "Jun — Aug 2021",
    role: "Engineer Intern",
    logos: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UnitedSafety-he5BAW2PQIu6zlRGCbyZNIUFLaCCHQ.png",
        alt: "United Safety",
      },
    ],
    id: "unitedsafety",
    responsibilities: [
      "Assembled blast-adaptive military seats and tested for performance issues.",
      "Trained in CAD techniques using SOLIDWORKS.",
      "Designed innovative 5-point harness restraint alternatives.",
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-24 md:py-40"
    >
      <SectionProgressHairline sectionRef={sectionRef} />
      <div className="container-editorial">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <StickyScrubHeader
              eyebrow="Where I've worked"
              title="Experience."
              sectionRef={sectionRef}
            />
          </div>

          <ol className="col-span-12 md:col-span-8 divide-y divide-border">
            {experiences.map((exp, i) => (
              <motion.li
                key={exp.id}
                id={`experience-${exp.id}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="grid grid-cols-12 gap-x-6 gap-y-3 py-8 md:py-10 first:pt-0 group"
              >
                <div className="col-span-12 md:col-span-4 text-sm text-muted-foreground">
                  {exp.period}
                </div>

                <div className="col-span-12 md:col-span-8">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl md:text-2xl font-medium">{exp.role}</h3>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-lg md:text-xl text-muted-foreground flex items-center gap-2">
                      {exp.company}
                      {exp.logos && (
                        <span className="flex items-center gap-1.5 ml-1">
                          {exp.logos.map((logo) => (
                            <span
                              key={logo.alt}
                              className="relative h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity"
                            >
                              <Image
                                src={logo.src}
                                alt={logo.alt}
                                fill
                                sizes="20px"
                                className="object-contain"
                              />
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="mt-1 text-sm text-muted-foreground">{exp.location}</div>
                  )}

                  <ul className="mt-5 space-y-2.5 max-w-2xl">
                    {exp.responsibilities.map((r, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-sm md:text-base text-foreground/85 leading-relaxed"
                      >
                        <span className="mt-2 h-px w-3 flex-shrink-0 bg-border" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
