"use client"

import Hero from "./components/Hero"
import Projects from "./components/Projects"
import Experience from "./components/Experience"
import EducationInvolvement from "./components/education-involvement"
import Contact from "./components/Contact"

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <EducationInvolvement />
      <Contact />
    </>
  )
}
