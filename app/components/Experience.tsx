"use client"

import { Briefcase, Calendar, MapPin, Globe, ChevronDown } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useState, useRef, useEffect } from "react"

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
    <div className="relative" ref={cardRef} id={`experience-${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full cursor-pointer w-full"
        onClick={() => setIsExpanded(true)}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex-1">
            <h3 className="font-semibold text-xl text-gray-800 dark:text-white flex items-center">
              {company === "Freelance" ? <Globe className="w-5 h-5 mr-2 text-blue-500" /> : null}
              {company}
              <div className="flex gap-2 items-center ml-2">
                {logos?.map((logo, logoIndex) => (
                  <div key={logoIndex} className={`relative ${logo.alt === "CATS2" ? "w-8 h-8" : "w-6 h-6"}`}>
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
            </h3>
            </div>
            <div className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2 flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {location}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2 flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {period}
          </p>
          <p className="text-gray-700 dark:text-gray-200 flex items-center font-medium">
            <Briefcase className="w-4 h-4 mr-2" />
            {role}
          </p>
        </div>
      </motion.div>

      {/* Modal/Dialog for expanded content */}
      {isExpanded && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsExpanded(false)} />
          <div className="fixed inset-x-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{company}</h2>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="flex gap-2">
                  {logos?.map((logo, logoIndex) => (
                    <div key={logoIndex} className={`relative ${logo.alt === "CATS2" ? "w-10 h-10" : "w-8 h-8"}`}>
                      <Image
                        src={logo.src}
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
                {location}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {period}
              </p>
              <p className="text-xl font-medium mb-4 dark:text-gray-200 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                {role}
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Responsibilities</h3>
                <ul className="list-none space-y-2">
                  {responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Experience() {
  const experiences = [
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
        "Working 40 hr/week as a full-time student at Evinova - a health-tech focused subsidiary within AstraZeneca.",
        "Currently engineering end-to-end frontend for production health analytics platform using Vite, React, & Storybook; developing real-time patient monitoring interface with D3.js and Framer Motion, achieving 40% reduction in clinical visits.",
        "Leveraged Pandas and NumPy for data processing, SciPy for bandpass filtering, and Matplotlib for visualizations; streamlined PCA and signal analysis on time series data, contributing to 32% reduction in trial costs.",
        "Implemented supervised binary and multi-class classification models achieving 96.9\% accuracy; employed k-fold cross-validation and confusion matrices to fine-tune thresholds, accelerating trial timelines by 6 months.",
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
      id: "cats2",
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
      id: "proxzar",
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
      id: "unitedsafety",
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
        <div className="grid grid-cols-1 gap-8 relative max-w-3xl mx-auto">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} {...exp} />
          ))}
        </div>
      </div>
    </section>
  )
}

