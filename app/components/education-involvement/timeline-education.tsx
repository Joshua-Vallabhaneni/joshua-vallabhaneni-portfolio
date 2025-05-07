"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Award, Briefcase, Book, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import InvolvementCards from "@/app/components/education-involvement/involvement-cards"

export default function TimelineEducation() {
  const [expandedSection, setExpandedSection] = useState<string | null>("coursework")

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const education = {
    degree: "Bachelor's Degree in Computer Science",
    institution: "University of Maryland - College Park",
    period: "2023 – 2026",
    major: "Computer Science (ML Track), Data Science",
    achievements: [
      "Dean's List (Fall 2023, Spring 2024, Fall 2024)",
      "President's Scholarship",
      "OMSE Academic Excellence",
    ],
    currentCoursework: ["Advanced Data Structures", "Intro to Data Science", "Applications of R for Data Science"],
    pastCoursework: [
      "Algorithms",
      "Organization of Programming Languages",
      "Applied Probability and Statistics I",
      "Computer Systems",
      "Discrete Structures",
      "Object-Oriented Programming I & II",
      "Linear Algebra",
    ],
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Main education card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{education.degree}</h3>
                <p className="text-lg text-purple-700 dark:text-purple-400 font-medium">{education.institution}</p>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                {education.period}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="outline"
                className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              >
                Major: {education.major.split(",")[0]}
              </Badge>
              <Badge
                variant="outline"
                className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              >
                Minor: {education.major.split(",")[1]}
              </Badge>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-4">
              {/* Achievements section */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <button
                  onClick={() => toggleSection("achievements")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-amber-500 mr-2" />
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Achievements</h4>
                  </div>
                  {expandedSection === "achievements" ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSection === "achievements" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pl-7">
                        <ul className="space-y-2">
                          {education.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-slate-700 dark:text-slate-300 flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-2"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Coursework section */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <button
                  onClick={() => toggleSection("coursework")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center">
                    <Book className="w-5 h-5 text-indigo-500 mr-2" />
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Coursework</h4>
                  </div>
                  {expandedSection === "coursework" ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSection === "coursework" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pl-7">
                        <h5 className="font-medium text-purple-700 dark:text-purple-400 mb-2">Current:</h5>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {education.currentCoursework.map((course, idx) => (
                            <Badge
                              key={idx}
                              className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200"
                            >
                              {course}
                            </Badge>
                          ))}
                        </div>

                        <h5 className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">Past:</h5>
                        <div className="flex flex-wrap gap-2">
                          {education.pastCoursework.map((course, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Involvement section */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <button
                  onClick={() => toggleSection("involvement")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Involvement</h4>
                  </div>
                  {expandedSection === "involvement" ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSection === "involvement" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3">
                        <InvolvementCards />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
