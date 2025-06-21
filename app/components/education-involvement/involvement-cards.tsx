"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Calendar, FlaskRoundIcon as Flask, Lightbulb, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function InvolvementCards() {
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const involvement = [
    {
      position: "Machine Learning Researcher",
      organization: "UMD, Department of Computer Science",
      location: "",
      period: "April 2025 – Present",
      icon: <Flask className="w-full h-full p-3 text-white" />,
      iconBg: "from-blue-500 to-cyan-500",
      description: [
        "Developing SuperFoldAE, a supervisedconvolutional autoencoder for protein-fold classification under Prof Alam, reaching 93.92% accuracy",
        "Benchmarking representation learning with unsupervised regularizers and reconstruction loss to boost generalization with 88.13% recall)."
      ],
    },
    {
      position: "Product Innovation Engineer",
      organization: "xFoundry@UMD",
      location: "",
      period: "Jan 2024 - Present",
      icon: <Lightbulb className="w-full h-full p-3 text-white" />,
      iconBg: "from-amber-500 to-orange-500",
      skills: ["Entrepreneurship", "Product Development", "AI Systems", "Real-time Detection"],
      description: [
        "1 of 30 students selected to join a 15-month program to launch a solution backed by $250K to $2M in funding.",
        "Developing an AI-enabled detection, tracking, and notification system capable of identifying active shooter events in K-12 schools and colleges in real-time.",
      ],
    },
  ]

  const handleCardHover = (index: number | null) => {
    setActiveCard(index)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {involvement.map((item, index) => (
        <motion.div
          key={index}
          ref={(el) => { cardRefs.current[index] = el; return undefined; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          onHoverStart={() => handleCardHover(index)}
          onHoverEnd={() => handleCardHover(null)}
          className={cn(
            "group relative modern-card glass-effect overflow-hidden transition-all duration-300",
            activeCard === index ? "shadow-2xl scale-[1.02] z-10" : "hover:shadow-xl hover:-translate-y-1",
          )}
        >


          {/* Card content */}
          <div className="p-6 pt-5">
            <div className="mb-3">
              <h3 className="text-lg font-bold gradient-text mb-1">
                {item.position}
              </h3>
              <p className="text-primary font-medium">{item.organization}</p>
            </div>

            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4 gap-3">
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {item.period}
              </div>

            </div>

            {/* Description */}
            <ul className="space-y-2 text-sm text-muted-foreground">
              {item.description.map((desc, idx) => (
                <li key={idx} className="flex">
                  <ChevronRight className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0 mt-0.5 mr-2" />
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hover effect overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300",
              activeCard === index ? "opacity-100" : "group-hover:opacity-100",
            )}
          ></div>
        </motion.div>
      ))}
    </div>
  )
}
