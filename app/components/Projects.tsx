"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

import { motion } from "framer-motion"
import { Github, Youtube, FileText, Newspaper, Twitter, ChevronDown, ExternalLink } from "lucide-react"
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
  id: string // Added unique ID for each project
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
  id, // Used as key in the parent component
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Refs for the collapsed card **and** the modal content
  const cardRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle outside-clicks **only when** the modal is open. We use the
  // modalRef to ensure clicks inside the expanded view don't immediately
  // close it.
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  return (
    <div className="relative group" ref={cardRef} id={`project-${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="modern-card hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 h-full cursor-pointer overflow-hidden"
        onClick={() => setIsExpanded(true)}
        whileHover={{ y: -5 }}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="modern-button-primary px-4 py-2 text-sm rounded-lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300 flex-shrink-0 ml-2" />
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
          
          <div className="text-xs text-muted-foreground mb-4">
            {date}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal/Dialog for expanded content rendered via portal */}
      {isExpanded &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={() => setIsExpanded(false)} />
            <div
              ref={modalRef}
              className="modal-content inset-x-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto modern-card animate-fadeIn"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold gradient-text">{title}</h2>
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="modern-button-ghost p-2 rounded-xl"
                    aria-label="Close details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="relative aspect-video mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {description}
                    </p>
                    {award && (
                      <div className="mb-4">
                        {Array.isArray(award) ? (
                          award.map((a, index) => (
                            <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-2 mr-2">
                              <span>🏆</span>
                              <span>{a}</span>
                            </div>
                          ))
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
                            <span>🏆</span>
                            <span>{award}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="modern-card p-4">
                      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Project Info</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="ml-2 font-medium">{date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {githubLink !== "#" && (
                    <Link
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-button-secondary px-4 py-2 rounded-lg"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Link>
                  )}
                  {youtubeLink && (
                    <Link
                      href={youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-button-ghost px-4 py-2 rounded-lg border border-border"
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      Demo
                    </Link>
                  )}
                  {additionalLinks?.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-button-ghost px-4 py-2 rounded-lg border border-border"
                    >
                      {link.icon}
                      <span className="ml-2">{link.text}</span>
                    </Link>
                  ))}
                  {newsLinks?.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-button-ghost px-4 py-2 rounded-lg border border-border"
                    >
                      <Newspaper className="h-4 w-4 mr-2" />
                      {link.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  )
}

export default function Projects() {
  const projects = [
    {
      title: "SwitchConfigSim: Network Switch Management Interface",
      description:
        "Built a comprehensive network switch management interface that mirrors enterprise-grade infrastructure patterns. The system provides dual interfaces (CLI and REST API) that both execute identical backend automation scripts, enabling hands-on experience with network device management workflows.",
      image: "/switchconfig.png", 
      githubLink: "https://github.com/Joshua-Vallabhaneni/SwitchConfigSim",
      youtubeLink: "https://youtu.be/GsN7T22HNzc",
      tags: ["Go", "Shell Scripting", "REST APIs", "OpenAPI", "Linux GNU Tools", "Makefile"],
      date: "June 2025 - July 2025",
      id: "switchconfigsim",
    },
    {
      title: "EcoQuery: Digital Carbon Footprint Extension",
      description:
        "Built a chrome extension that empowers users to make environmentally conscious decisions about their digital queries. The system intercepts ChatGPT queries in real-time, analyzes environmental impact using research-backed calculations, and provides instant comparisons with Google Search alternatives, enabling informed choices about digital carbon footprint.",
      image: "/ecoquery.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/Eco-Query-Extension",
      tags: ["Chrome Extension", "JavaScript (Vanilla)", "HTML/CSS"],
      date: "November 2024 - June 2025",
      additionalLinks: [
        {
          text: "Chrome Store",
          url: "https://chromewebstore.google.com/detail/mcbcdggkligdjpcdpijnmiknbhmcefjl?utm_source=item-share-cb",
          icon: <ExternalLink className="h-4 w-4" />,
        },
      ],
      id: "ecoquery",
    },
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
      id: "codeshot",
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
      id: "qure",
      additionalLinks: [
        {
          text: "Website",
          url: "https://www.qure.dev/",
          icon: <ExternalLink className="h-4 w-4" />,
        },
      ],
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
      id: "firesync",
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
      id: "ignite",
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
      id: "cypressmfa",
    },
    {
      title: "SkyCast: Flight Delay Predictor",
      description:
        "Developed a Flask-based application that harnesses the Open-Meteo API to predict flight delays by analyzing 5 real-time weather metrics. Engineered a RandomForestRegressor model using pandas and scikit-learn.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SkyCast-CmhbsjfuZMGgH7SAQsK2Mv0eKVWUEy.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/SkyCast",
      tags: ["Python", "JavaScript", "React", "Flask", "MySQL"],
      date: "April 2024 - June 2024",
      id: "skycast",
    },
    {
      title: "Drug Efficacy Analysis and Prediction Tool",
      description:
        "Employed JDBC to connect to a MySQL database and utilized SQL queries to analyze the efficacy of the drug Tagrisso. Executed OLS Multiple Linear Regression using Apache Commons Math for model training and predictive analytics.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drugefficacy-pJJYtJobIHkdTFrWyjUz4qeYBFRzE8.png",
      githubLink: "https://github.com/Joshua-Vallabhaneni/EfficacyPredictionModel",
      tags: ["Java", "JDBC", "Apache Commons Math", "MySQL"],
      date: "December 2024 - January 2024",
      id: "drugefficacy",
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
      id: "vitalsmart",
    },
    {
      title: "Clevr - Peer Tutoring Learning Management System",
      description:
        "Created an automated matchmaking software that has efficiently connected over 700 users. Employs algorithmic techniques via Google Apps Script to foster resident learning hubs hands-free.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clevr-1nwpq68nsaOGstF6YEasuJyfc58eTu.png",
      githubLink: "https://github.com/Clevr-LMS",
      tags: ["JavaScript", "Google Apps Script"],
      date: "May 2020 - June 2023",
      id: "clevr",
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
      id: "babysaver",
    },
  ]

  return (
    <section
      id="projects"
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Featured Projects" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

