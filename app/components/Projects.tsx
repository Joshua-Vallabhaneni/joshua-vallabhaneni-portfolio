"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Github, Youtube, FileText, Newspaper, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import AnimatedSectionHeader from "./AnimatedSectionHeader"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  githubLink: string
  youtubeLink?: string
  tags: string[]
  date: string
  award?: string | string[]
  additionalLinks?: Array<{ text: string; url: string; icon: React.ReactNode }>
  newsLinks?: Array<{ text: string; url: string }>
}

function ProjectCard({
  title,
  description,
  image,
  githubLink,
  youtubeLink,
  tags,
  date,
  award,
  additionalLinks,
  newsLinks,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-video">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-2 text-gray-800 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{date}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        {award &&
          (Array.isArray(award) ? (
            award.map((a, index) => (
              <p key={index} className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                🏆 {a}
              </p>
            ))
          ) : (
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-4">🏆 {award}</p>
          ))}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {githubLink !== "#" && (
            <Link
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          )}
          {youtubeLink && (
            <Link
              href={youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              <Youtube className="h-4 w-4" />
              Demo
            </Link>
          )}
          {additionalLinks?.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              {link.icon}
              {link.text}
            </Link>
          ))}
          {newsLinks?.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              <Newspaper className="h-4 w-4" />
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const projects = [
    {
      title: "CodeShot: Pixel-Perfect AI Frontend Engineer",
      description:
        "Built a system that converts design mockups into production-ready code. Combines CV, RL, and agent-based reasoning to explore code variants and evaluate them via a custom similarity metric. Leveraged NVIDIA H100s on CoreWeave to cut rendering time from 20 -> 5 minutes, outperforming v0 and bolt by 5% in visual similarity.",
      image: "/codeshot.png",
      githubLink: "#",
      tags: ["Python", "OpenCV", "PyTorch", "LangChain", "React", "FastAPI", "Docker"],
      date: "Feb 2025 - April 2025",
      award: "2nd Place Overall at Inference-Time Compute Hackathon",
      additionalLinks: [
        {
          text: "X Post",
          url: "https://x.com/cognition_labs/status/1896737373872103692",
          icon: <Twitter className="h-4 w-4" />,
        },
      ],
      youtubeLink: "https://www.youtube.com/watch?v=ib1SBuyamSY",
    },
    {
      title: "QuRE: Query Routing Engine",
      description:
        "Built a smart routing system that optimizes LLM API usage for businesses/users. The product analyzes incoming prompts, predicts response complexity and length for different LLM models, and automatically routes queries to the most cost-effective model while maintaining output quality.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7sb4ZVKsvMCha6Os6Dcs0iym0CG6NG.png",
      githubLink: "https://github.com/thobonato/azalea-ai-ml",
      youtubeLink: "https://www.youtube.com/watch?v=OSJig11XJxE&t=1s",
      tags: ["Python", "JavaScript", "React", "Node.js", "FastAPI", "MongoDB"],
      date: "June 2024 - Present",
      award: "First Place Overall at AI for Change Hackathon",
    },
    {
      title: "FireSync: AI-Powered Disaster Recovery Platform",
      description:
        "Developed a next-generation disaster recovery platform that empowers wildfire-stricken communities to rebuild faster and smarter. FireSync uses AI for intelligent volunteer-task matching, real-time coordination, and impact tracking.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/firesync-jb0vNaeaWJxdwrGgKcOLTvbTKixDl7.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/Wildfire",
      youtubeLink: "https://www.youtube.com/watch?v=hF7xo23Fj6g",
      tags: ["React", "Node.js", "Express.js", "Storybook", "MongoDB Atlas", "RAG"],
      date: "January 2024",
    },
    {
      title: "Ignite: ML-Driven Nonprofit Matching Engine",
      description:
        "Engineered full-stack web app using React, Flask, MongoDB featuring custom-made automated matching algorithm, Google/LinkedIn API, NLP-based mission alignment scoring, and email automation.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0EVZVGMPSbFomDLwGqMNH83zaCbJ7B.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/cypress-penn-apps",
      youtubeLink: "https://youtu.be/RGob0Xzvbho?si=x9KLLtSYsgQAysC5",
      tags: ["Python", "JavaScript", "React", "Flask", "MongoDB"],
      date: "October 2024",
      award: "1st Place Winner at JP Morgan's Code for Good Hackathon",
    },
    {
      title: "CypressMFA: Gesture-Driven Facial Authentication",
      description:
        "Engineered a Chrome extension for 3FA using Python, FastAPI, and MongoDB Atlas, incorporating real-time liveness detection, facial recognition, and dynamic hand gesture recognition.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cypress-P2aTSvrBkHcdQRhE2cR3V0zMDUyEVn.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/cypress-penn-apps",
      youtubeLink: "https://youtu.be/RGob0Xzvbho?si=x9KLLtSYsgQAysC5",
      tags: ["Chrome Extension", "Python", "JavaScript", "React", "Node.js", "FastAPI", "MongoDB"],
      date: "September 2024 - October 2024",
      award: [
        "2nd Place Best Privacy/Security Hack",
        "2nd Place Best Use of Computer Vision at PennApps XXV Hackathon",
      ],
    },
    {
      title: "SkyCast: Flight Delay Predictor",
      description:
        "Developed a Flask-based application that harnesses the Open-Meteo API to predict flight delays by analyzing 5 real-time weather metrics. Engineered a RandomForestRegressor model using pandas and scikit-learn.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SkyCast-CmhbsjfuZMGgH7SAQsK2Mv0eKVWUEy.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/SkyCast",
      tags: ["Python", "JavaScript", "React", "Flask", "MySQL"],
      date: "April 2024 - June 2024",
    },
    {
      title: "Drug Efficacy Analysis and Prediction Tool",
      description:
        "Employed JDBC to connect to a MySQL database and utilized SQL queries to analyze the efficacy of the drug Tagrisso. Executed OLS Multiple Linear Regression using Apache Commons Math for model training and predictive analytics.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drugefficacy-pJJYtJobIHkdTFrWyjUz4qeYBFRzE8.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/EfficacyPredictionModel",
      tags: ["Java", "JDBC", "Apache Commons Math", "MySQL"],
      date: "December 2024 - January 2024",
    },
    {
      title: "Vital Smart: IoT based In-Home Health Monitoring System",
      description:
        "Developed a system for measuring multiple vitals, storing results, and displaying them in real-time through a web portal and mobile application. Features a custom-built AI-based advice engine for basic health diagnostics.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VitalSmart-4s5ZxC4I9d3apCVHNKHE53Pwe5Q3aW.png",
      githubLink: "#",
      tags: ["Arduino", "C++", "Firebase", "Twilio", "IoT"],
      date: "June 2021 - August 2023",
      additionalLinks: [
        {
          text: "Project Report",
          url: "https://drive.google.com/file/d/1Mhg4poBOvAkDqOvZpnrxnzWYlUmmDE7G/view?usp=sharing",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Clevr - Peer Tutoring Learning Management System",
      description:
        "Created an automated matchmaking software that has efficiently connected over 700 users. Employs algorithmic techniques via Google Apps Script to foster resident learning hubs hands-free.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clevr-1nwpq68nsaOGstF6YEasuJyfc58eTu.png",
      githubLink: "https://github.com/Clevr-LMS",
      tags: ["JavaScript", "Google Apps Script"],
      date: "May 2020 - June 2023",
    },
    {
      title: "Baby Saver - Hot Car Alert Device",
      description:
        "Developed a device to prevent hot car child deaths by detecting a baby in a car seat and sending automated alerts when the car's temperature crosses certain thresholds. Features a multi-level alert system.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/babysaver-GWpcK23wCCzoNBJXDHzXCfppxTOc6L.png",
      githubLink: "#",
      tags: ["Arduino", "C++", "IoT"],
      date: "September 2018 - August 2020",
      newsLinks: [
        {
          text: "Philadelphia Inquirer",
          url: "https://www.inquirer.com/life/pranavh-joshua-vallabhaneni-invented-baby-saver-hot-car-alert-device-20200819.html",
        },
        {
          text: "Fox News",
          url: "https://www.fox29.com/video/845647",
        },
      ],
    },
  ]

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Featured Projects" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

