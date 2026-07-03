"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { StickyScrubHeader } from "../motion/StickyScrubHeader";
import { SectionProgressHairline } from "../motion/SectionProgressHairline";

export default function EducationInvolvement() {
  const sectionRef = useRef<HTMLElement>(null);

  const education = {
    degree: "B.S. Computer Science — ML Track",
    minor: "Minor in Data Science",
    institution: "University of Maryland, College Park",
    period: "2023 — 2027",
    achievements: [
      "Dean's List (all semesters)",
      "President's Scholarship",
      "OMSE Academic Excellence",
    ],
  };

  const involvement = [
    {
      position: "Machine Learning Researcher",
      organization: "UMD, Department of Computer Science",
      period: "Apr 2025 — Present",
      highlights: [
        "Researching a supervised convolutional autoencoder for protein fold classification under Dr. Fardina Alam.",
        "CSBW 2025 Best Paper for ConSOLAE, a contractive autoencoder framework for protein fold recognition.",
      ] as string[],
      publicationLink: "https://dl.acm.org/doi/10.1145/3768322.3769023",
    },
    {
      position: "Full-Stack Developer",
      organization: "xFoundry @ UMD",
      organizationLink:
        "https://www.linkedin.com/posts/university-of-maryland_congratulations-to-the-umd-student-team-defenx-activity-7373369138905325568-RWY1/",
      period: "Jan 2024 — Present",
      highlights: [
        "Received $250k investment for an AI-driven tool to better protect schools from gun violence.",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="education"
      className="relative py-24 md:py-40"
    >
      <SectionProgressHairline sectionRef={sectionRef} />
      <div className="container-editorial">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <StickyScrubHeader
              eyebrow="Study & research"
              title="Education."
              sectionRef={sectionRef}
            />
          </div>

          <div className="col-span-12 md:col-span-8 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className="eyebrow mb-4">Degree</div>
              <h3 className="text-2xl md:text-3xl font-medium leading-tight">
                {education.degree}
              </h3>
              <p className="mt-2 text-muted-foreground">{education.minor}</p>
              <p className="mt-6 text-base">{education.institution}</p>
              <p className="mt-1 text-sm text-muted-foreground">{education.period}</p>

              <div className="mt-8">
                <div className="eyebrow mb-3">Honors</div>
                <ul className="space-y-2">
                  {education.achievements.map((a) => (
                    <li key={a} className="flex gap-3 text-sm text-foreground/85">
                      <span className="mt-2 h-px w-3 flex-shrink-0 bg-border" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="eyebrow mb-4">Involvement</div>
              <ol className="divide-y divide-border">
                {involvement.map((item, i) => (
                  <li key={i} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="text-lg md:text-xl font-medium">{item.position}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>
                    {item.organizationLink ? (
                      <Link
                        href={item.organizationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.organization}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{item.organization}</p>
                    )}

                    <ul className="mt-4 space-y-2">
                      {item.highlights.map((h, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm text-foreground/85 leading-relaxed"
                        >
                          <span className="mt-2 h-px w-3 flex-shrink-0 bg-border" />
                          {h}
                        </li>
                      ))}
                      {"publicationLink" in item && item.publicationLink && (
                        <li className="flex gap-3 text-sm leading-relaxed">
                          <span className="mt-2 h-px w-3 flex-shrink-0 bg-foreground/70" />
                          <Link
                            href={item.publicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-foreground link-underline"
                          >
                            Read the publication
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
