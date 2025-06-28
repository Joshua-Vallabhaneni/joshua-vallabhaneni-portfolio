"use client"

import Image from "next/image"
import { GitlabIcon as GitHub, Linkedin, Mail, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { Vortex } from "@/components/ui/vortex"

const GridPattern = () => (
  <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="grid-pattern"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
)

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
  </div>
)

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen relative overflow-hidden"
    >
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex items-center justify-center w-full h-full"
        containerClassName="absolute inset-0"
      >
        {/* Background Elements */}
        <GridPattern />
        <FloatingOrbs />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Joshua</span>
                <br />
                <span className="text-foreground">Vallabhaneni</span>
              </h1>
              
              <h2 className="text-xl md:text-2xl font-medium mb-6 text-muted-foreground">
                Full-Stack Developer & ML Researcher
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Hi! I'm Joshua - an inventor, analyst and learner studying CS + Data Science at UMD, College Park. In my free time, you'll probably find me watching a show, cooking something new, or working out! 
              </p>
              
              {/* Social Links */}
              <div className="flex justify-center lg:justify-start gap-4 mb-8">
                <motion.a
                  href="https://github.com/Joshua-Vallabhaneni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-button-ghost p-3 rounded-xl"
                  aria-label="GitHub Profile"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GitHub className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/joshua-vallabhaneni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-button-ghost p-3 rounded-xl"
                  aria-label="LinkedIn Profile"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="mailto:pjvallabhaneni@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-button-ghost p-3 rounded-xl"
                  aria-label="Email Contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              </div>
              
              {/* CTA Button */}
              <motion.button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="modern-button-primary px-8 py-4 text-base font-medium rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View My Work
                <ArrowDown className="w-4 h-4 ml-2" />
              </motion.button>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl transform rotate-3 blur-md" />
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/20 to-primary/20 rounded-3xl transform -rotate-3 blur-md" />
                
                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden modern-shadow">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yourphoto.JPG-KbKEkQ2jSxTip4vML51js2jXZdb86P.jpeg"
                    alt="Joshua Vallabhaneni"
                    width={400}
                    height={400}
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent animate-glow" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce mt-2" />
        </motion.div>
      </Vortex>
    </section>
  )
}

