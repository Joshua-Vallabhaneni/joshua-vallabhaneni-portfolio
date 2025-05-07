"use client"

import { motion } from "framer-motion"

interface AnimatedSectionHeaderProps {
  title: string
}

export default function AnimatedSectionHeader({ title }: AnimatedSectionHeaderProps) {
  return (
    <motion.h2
      className="text-4xl font-bold mb-12 text-center dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="inline-block relative">
        {title}
        <span className="absolute -bottom-1 left-0 right-0 h-1 bg-purple-500 dark:bg-purple-400 transform skew-x-12"></span>
      </span>
    </motion.h2>
  )
}

