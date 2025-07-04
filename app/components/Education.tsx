"use client"

import { GraduationCap, Calendar, Award, Book } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { motion } from "framer-motion"

export default function Education() {
  const education = [
    {
      degree: "Bachelor's Degree in Computer Science",
      institution: "University of Maryland - College Park",
      period: "2023 – 2026",
      major: "Computer Science (ML Track), Data Science",
      achievements: [
              "Dean's List (All Semesters)",
      "President's Scholarship",
        "OMSE Academic Excellence",
      ],
      currentCoursework: ["Advanced Data Structures, Intro to Data Science, Applications of R for Data Science"],
      pastCoursework: [
        "Algorithms, Organization of Programming Languages, Applied Probability and Statistics I",
        "Computer Systems, Discrete Structures",
        "Object-Oriented Programming I & II, Linear Algebra",
      ],
    },
  ]

  return (
    <section
      id="education"
      className="py-20 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Education" />
        <div className="max-w-3xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-200 dark:bg-purple-700 rounded-br-full z-0 opacity-50"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-2 dark:text-white flex items-center">
                  <GraduationCap className="w-6 h-6 mr-2" />
                  {edu.degree}
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{edu.institution}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {edu.period}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                  <Book className="w-4 h-4 mr-2" />
                  Major/Minor: {edu.major}
                </p>
                <h4 className="text-lg font-medium mb-2 dark:text-gray-200 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements:
                </h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  {edu.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      {achievement}
                    </li>
                  ))}
                </ul>
                <h4 className="text-lg font-medium mb-2 dark:text-gray-200">Current Coursework:</h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  {edu.currentCoursework.map((course, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      {course}
                    </li>
                  ))}
                </ul>
                <h4 className="text-lg font-medium mb-2 dark:text-gray-200">Past Coursework:</h4>
                <ul className="list-disc list-inside space-y-2">
                  {edu.pastCoursework.map((course, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

