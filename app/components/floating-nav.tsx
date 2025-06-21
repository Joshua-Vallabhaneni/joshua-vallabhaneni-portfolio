"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Home, Briefcase, Code, GraduationCap, Mail, FolderOpen } from "lucide-react"

const sections = [
  { id: "hero", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
]

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="glass-effect rounded-2xl p-3 modern-shadow">
        <div className="flex flex-col gap-2">
          {sections.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className="group relative flex items-center justify-center p-3 rounded-xl transition-all duration-300"
              aria-label={`Scroll to ${label}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Tooltip */}
              <div className="absolute right-16 px-3 py-2 rounded-lg bg-card border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-border border-y-4 border-y-transparent"></div>
              </div>
              
              {/* Active indicator */}
              {activeSection === id && (
                <motion.div
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <Icon className={`w-5 h-5 transition-colors duration-300 ${
                activeSection === id
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              }`} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

