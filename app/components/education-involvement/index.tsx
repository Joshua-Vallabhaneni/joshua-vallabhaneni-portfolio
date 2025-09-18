"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, Award, Book, Briefcase, Trophy, ChevronRight, ExternalLink } from "lucide-react"
import AnimatedSectionHeader from "../AnimatedSectionHeader"
import Link from "next/link"

export default function EducationInvolvement() {
  const education = {
    degree: "Bachelor's Degree in Computer Science",
    institution: "University of Maryland - College Park",
    period: "2023 – 2026",
    major: "Computer Science (ML Track)",
    minor: "Data Science",
    achievements: [
      "Dean's List (All Semesters)",
      "President's Scholarship", 
      "OMSE Academic Excellence"
    ]
  }

  const involvement = [
    {
      position: "Machine Learning Researcher",
      organization: "UMD, Department of Computer Science",
      period: "April 2025 – Present",
      highlights: [
        "Presenting ConSOLAE at CSBW 2025, a contractive autoencoder framework for protein fold recognition.",
        "Achieved 96.48% accuracy on SCOP benchmark dataset, surpassing prior fold-classification baselines.",
        "Benchmarked representation learning with unsupervised regularizers to boost generalization (88.13% recall)."
      ]
    },
    {
      position: "Full Stack Developer", 
      organization: "xFoundry@UMD",
      organizationLink: "https://www.linkedin.com/posts/university-of-maryland_congratulations-to-the-umd-student-team-defenx-activity-7373369138905325568-RWY1/",
      period: "Jan 2024 - Present",
      highlights: [
        "Received 250k investment for an AI-driven tool to better protect schools from gun violence.",
      ]
    }
  ]

  return (
    <section id="education" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      <div className="container relative z-10 mx-auto px-6">
        <AnimatedSectionHeader title="Education & Involvement" />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="modern-card p-8 h-fit"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">{education.degree}</h3>
                  <p className="text-muted-foreground">{education.institution}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {education.period}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    <Book className="w-3 h-3 mr-1" />
                    Major: {education.major}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    <Book className="w-3 h-3 mr-1" />
                    Minor: {education.minor}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center">
                    <Trophy className="w-4 h-4 mr-1" />
                    ACHIEVEMENTS
                  </h4>
                  <div className="space-y-1">
                    {education.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 flex-shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Involvement Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >

              <div className="space-y-4">
                {involvement.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="modern-card p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="mb-3">
                      <h4 className="font-semibold text-lg mb-1">{item.position}</h4>
                      {item.organizationLink ? (
                        <Link 
                          href={item.organizationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary font-medium text-sm hover:underline inline-flex items-center group underline decoration-primary/30 hover:decoration-primary/70 transition-all"
                        >
                          {item.organization}
                          <ExternalLink className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ) : (
                        <p className="text-primary font-medium text-sm">{item.organization}</p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.period}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {item.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start text-sm text-muted-foreground">
                          <ChevronRight className="w-3 h-3 text-primary mt-0.5 mr-2 flex-shrink-0" />
                          <span className="leading-relaxed">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
