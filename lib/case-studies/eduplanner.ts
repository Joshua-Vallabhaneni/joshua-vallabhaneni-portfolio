import type { CaseStudy } from "./index";

export const eduplanner: CaseStudy = {
  slug: "eduplanner",
  slots: [
    {
      type: "hero",
      title: "EduPlanner",
      eyebrow: "2025 · 1,300+ students using daily",
      tags: ["React", "Vite", "PostgreSQL", "OpenRouter"],
      summary:
        "An AI-powered career scheduling engine that builds personalized four-year academic roadmaps, connecting coursework to extracurricular activities and adapting when students change paths.",
    },
    {
      type: "narrative",
      paragraphs: [
        "Most academic planning tools treat a degree as a checklist. EduPlanner treats it as a graph: courses, prerequisites, career interests, extracurriculars, and required experiences are all nodes, and the planner finds a path through them that satisfies the user's constraints and signals their direction.",
        "Under the hood, the system uses OpenRouter to route prompts to whichever model is cheapest for the planning step at hand — fast cheap models for slot-filling, larger models for the harder reasoning steps. This kept inference cost low enough to support a free tier while the user base grew.",
        "Over 1,300 students use EduPlanner to manage their plans. The interesting design problem turned out to be the change flow: when a student decides to switch majors or add a research interest in their junior year, the planner has to re-plan against work they have already done without throwing away credits. Most of the engineering time went into making that flow feel calm rather than punishing.",
      ],
    },
    {
      type: "imageScrub",
      src: "/eduplanner.png",
      alt: "EduPlanner interface showing a four-year academic roadmap with courses, extracurriculars, and career-track recommendations.",
      width: 2400,
      height: 1350,
    },
    {
      type: "links",
      links: [],
    },
  ],
};
