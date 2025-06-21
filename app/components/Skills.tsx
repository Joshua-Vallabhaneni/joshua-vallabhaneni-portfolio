"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Terminal, Layers, Cpu, Brain, Zap } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import React from "react" 

const SkillIcon = ({ icon: Icon, color }: { icon: React.ElementType; color: string }) => (
  <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg backdrop-blur-sm`}>
    <Icon className="w-6 h-6 text-white" />
  </div>
)

const skills = [
  {
    icon: Terminal,
    name: "Programming Languages",
    tech: "Python, Java, C, C++, Rust, R, JavaScript, HTML, CSS",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Server,
    name: "Backend Development",
    tech: "Node.js, Next.js, Express.js, Flask, FastAPI",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Code,
    name: "Frontend Development",
    tech: "React.js, Vite, Storybook, Tailwind, Shadcn UI",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Database,
    name: "Database Management",
    tech: "MongoDB, AWS, MySQL, Firebase, Supabase",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Layers,
    name: "Data Analysis",
    tech: "pandas, NumPy, SciPy, matplotlib, Tableau",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Brain,
    name: "Machine Learning",
    tech: "scikit-learn, PyTorch, TensorFlow, nltk",
    color: "from-fuchsia-500 to-fuchsia-600",
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader 
          title="Skills & Expertise" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="modern-card hover:shadow-2xl group transition-all duration-500 h-full">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <SkillIcon icon={skill.icon} color={skill.color} />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                        {skill.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.tech.split(', ').map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

