"use client"

import { Briefcase, Calendar, MapPin, Globe, ChevronDown, ExternalLink } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface ExperienceCardProps {
  company: string;
  location: string;
  period: string;
  role: string;
  logos?: Array<{ src: string; alt: string }>;
  responsibilities: string[];
  id: string;
}

function ExperienceCard({
  company,
  location,
  period,
  role,
  logos,
  responsibilities,
  id,
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle click outside to close the expanded card
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

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
    <div className="relative group" ref={cardRef} id={`experience-${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="modern-card hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 h-full cursor-pointer"
        onClick={() => setIsExpanded(true)}
        whileHover={{ y: -5 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {company === "Freelance" ? <Globe className="w-5 h-5 mr-2 text-primary inline" /> : null}
                  {company}
                </h3>
                {logos && (
                  <div className="flex gap-2 items-center">
                    {logos.map((logo, logoIndex) => (
                      <div key={logoIndex} className={`relative ${logo.alt === "CATS2" ? "w-8 h-8" : "w-6 h-6"} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          fill
                          className="object-contain"
                          sizes="24px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-primary font-medium mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {role}
              </p>
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl group-hover:bg-primary/10 transition-colors duration-300">
              <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-primary/70" />
              {location}
            </p>
            <p className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-primary/70" />
              {period}
            </p>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        </div>
      </motion.div>

      {/* Modal/Dialog for expanded content rendered via portal */}
      {isExpanded &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={() => setIsExpanded(false)} />
            <div className="modal-content inset-x-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto modern-card animate-fadeIn">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold gradient-text">{company}</h2>
                    {logos && (
                      <div className="flex gap-2">
                        {logos.map((logo, logoIndex) => (
                          <div key={logoIndex} className={`relative ${logo.alt === "CATS2" ? "w-12 h-12" : "w-10 h-10"}`}>
                            <Image
                              src={logo.src}
                              alt={logo.alt}
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      {role}
                    </h3>
                    
                    <div className="space-y-3">
                      {responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <p className="text-muted-foreground leading-relaxed">{resp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="modern-card p-4">
                      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Position Details</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground flex items-center mb-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            Location:
                          </span>
                          <span className="ml-6 font-medium">{location}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground flex items-center mb-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            Period:
                          </span>
                          <span className="ml-6 font-medium">{period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

export default function Experience() {
  const experiences = [
    {
      company: "PayPal",
      location: "San Jose, CA",
      period: "May 2025 - August 2025",
      role: "Software Engineer Intern",
      logos: [
        {
          src: "/paypal.png",
          alt: "PayPal",
        },
      ],
      id: "paypal",
      responsibilities: [
        "Automating CI test workflow through 3 agentic AI workflows for PR creation, removing manual configuration steps.",
      ],
    },
    {
      company: "AstraZeneca - Evinova",
      location: "Gaithersburg, MD",
      period: "May 2024 - May 2025",
      role: "Full-Time Junior Software Engineer",
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
      id: "astrazeneca",
      responsibilities: [
        "Worked 40 hr/week as a full-time student at Evinova - a health-tech focused subsidiary within AstraZeneca.",
        "Led development for production health analytics platform using Vite, React, & Storybook; created real-time patient monitoring interface using D3.js and Motion.",
        "Streamlined time series processing, PCA, and signal analysis (Pandas/NumPy/SciPy).",
        "Devised binary/multiclass classifiers using k-fold CV and confusion matrices to tune thresholds.",
      ],
    },
    {
      company: "CATS2",
      location: "Sunnyvale, CA",
      period: "May 2024 - August 2024",
      role: "Human-Computer Interaction Intern",
      logos: [
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CATS2-34rTJBy4GZxzJxcXnDZOutCathbk2N.png",
          alt: "CATS2",
        },
      ],
      id: "cats2",
      responsibilities: [
        "Conducted user testing sessions to enhance OWL app usability",
        "Developed feedback questionnaires to gather actionable insights",
        "Produced reports on findings by applying UX design heuristics",
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
      id: "proxzar",
      responsibilities: [
        "Gained proficiency in Proxzar AI/NLP technologies, aiding in boosting text analysis",
        "Engineered React UI with Transformer NLP for intent/entity extraction, boosting throughput.",
        "Deployed 5 semantic-search interfaces with contextual embeddings and dynamic ranking.",
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
      id: "unitedsafety",
      responsibilities: [
        "Assembled blast-adaptive military seats",
        "Tested for performance issues and optimizations",
        "Trained in CAD techniques using SOLIDWORKS",
        "Designed innovative 5-point harness restraint alternatives",
      ],
    },
  ];

  return (
    <section id="experience" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-primary/5" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader 
          title="Professional Experience" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} {...experience} />
          ))}
        </div>
      </div>
    </section>
  );
}

