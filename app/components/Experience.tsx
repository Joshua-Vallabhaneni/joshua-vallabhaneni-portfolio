"use client"

import { Briefcase, Calendar, MapPin, Globe } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSectionHeader from "./AnimatedSectionHeader"

export default function Experience() {
  const experiences = [
    {
      company: "AstraZeneca - Evinova",
      location: "Gaithersburg, MD",
      period: "May 2024 - August 2024",
      role: "Full-Time Software Engineer",
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
      responsibilities: [
        "Working 40 hr/week as a full-time student at Evinova - a health-tech focused subsidiary within AstraZeneca.",
        "Currently engineering end-to-end frontend for production health analytics platform using Vite, React, & Storybook; developing real-time patient monitoring interface with D3.js and Framer Motion, achieving 40% reduction in clinical visits.",
        "Leveraged Pandas for data ingestion, NumPy for array manipulations, SciPy for bandpass filtering, and Matplotlib for visualizations; streamlined PCA and signal analysis on time series data, contributing to 32% reduction in trial costs. Implemented a supervised learning model using scikit-learn's fine tree algorithm for binary and multi-class classification, achieving up to 96.9% accuracy.",
        "Employed k-fold cross-validation for substantial bias reduction, and utilized confusion matrices to fine-tune classification thresholds, pivotal in accelerating trial timelines by 6 months.",
      ],
    },
    {
      company: "The Center for Applied Technologies for School Security",
      location: "Sunnyvale, CA",
      period: "May 2024 - August 2024",
      role: "Human-Computer Interaction Intern",
      logos: [
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CATS2-34rTJBy4GZxzJxcXnDZOutCathbk2N.png",
          alt: "CATS2",
        },
      ],
      responsibilities: [
        "Conducted user testing sessions to enhance OWL app usability",
        "Developed feedback questionnaires to gather actionable insights",
        "Produced reports on findings by applying UX design heuristics",
        "Supported efforts to create a safer learning environment",
      ],
    },
    {
      company: "Proxzar.AI",
      location: "East Brunswick, NJ",
      period: "Jun 2022 - Aug 2022",
      role: "Software Engineer Intern",
      logos: [
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proxzar-PWgXWn1QGHwoj2dyNwCAg9VF3fF4c3.png",
          alt: "Proxzar",
        },
      ],
      responsibilities: [
        "Gained proficiency in Proxzar AI/NLP technologies, aiding in boosting text analysis processing speeds by 20%.",
        "Innovated conversational chatbots from complex datasets using React, enhancing user interaction for 250+ clients.",
        "Led deployment of 5 UIs for chatbot and contextual search features, increasing user satisfaction scores by 35%.",
      ],
    },
    {
      company: "United Safety & Survivability Corporation",
      location: "Exton, PA",
      period: "Jun 2021 - Aug 2021",
      role: "Engineer Intern",
      logos: [
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UnitedSafety-he5BAW2PQIu6zlRGCbyZNIUFLaCCHQ.png",
          alt: "United Safety",
        },
      ],
      responsibilities: [
        "Assembled blast-adaptive military seats",
        "Tested for performance issues and optimizations",
        "Trained in CAD techniques using SOLIDWORKS",
        "Designed innovative 5-point harness restraint alternatives",
      ],
    },
  ]

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Professional Experience" />
        <div className="space-y-16">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-700 rounded-bl-full z-0 opacity-50 
                transition-transform duration-300 group-hover:scale-110"
              ></div>
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <h3 className="text-2xl font-semibold dark:text-white flex items-center mr-4">
                    {exp.company === "Freelance" ? <Globe className="w-6 h-6 mr-2 text-blue-500" /> : null}
                    {exp.company}
                  </h3>
                  <div className="flex gap-2">
                    {exp.logos?.map((logo, logoIndex) => (
                      <div key={logoIndex} className={`relative ${logo.alt === "CATS2" ? "w-10 h-10" : "w-8 h-8"}`}>
                        <Image
                          src={logo.src || "/placeholder.svg"}
                          alt={logo.alt}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {exp.location}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {exp.period}
                </p>
                <p className="text-xl font-medium mb-4 dark:text-gray-200 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  {exp.role}
                </p>
                <ul className="list-none space-y-2">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

