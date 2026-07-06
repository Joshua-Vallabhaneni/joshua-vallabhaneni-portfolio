"use client"

import Hero from "./components/Hero"
import Projects from "./components/Projects"
import Freelance from "./components/Freelance"
import Experience from "./components/Experience"
import EducationInvolvement from "./components/education-involvement"

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Freelance />
      <Experience />
      <EducationInvolvement />
    </>
  )
}
