"use client"

import { motion } from "framer-motion"

interface AnimatedSectionHeaderProps {
  title: string
  subtitle?: string
}

export default function AnimatedSectionHeader({ title, subtitle }: AnimatedSectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="gradient-text">{title}</span>
      </motion.h2>
      
      {subtitle && (
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Decorative line */}
      <motion.div
        className="w-24 h-1 bg-gradient-to-r from-primary to-emerald-500 mx-auto mt-6 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: 96 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  )
}

