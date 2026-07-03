import type { CaseStudy } from "./index";

export const codeshot: CaseStudy = {
  slug: "codeshot",
  slots: [
    {
      type: "hero",
      title: "CodeShot",
      eyebrow: "2025 · Inference-Time Compute Hackathon · 2nd Place",
      tags: ["Python", "OpenCV", "PyTorch", "LangChain", "React", "FastAPI", "Docker"],
      summary:
        "A system that converts design mockups into production-ready code by combining computer vision, reinforcement learning, and agent-based reasoning to explore code variants and evaluate them via a custom similarity metric.",
    },
    {
      type: "narrative",
      paragraphs: [
        "Most design-to-code tools generate one output and call it done. CodeShot generates many, evaluates each, and lets the best one win. The system runs an agent loop that proposes a code variant, renders it, and compares the rendered output to the input mockup with a custom visual-similarity metric — pixel-aware but layout-tolerant. The loop continues until similarity stops improving.",
        "The inference path was the bottleneck. The naive implementation rendered each variant in series and took ~20 minutes per mockup, which is slower than a designer can hand-build the page. We moved the rendering pipeline onto NVIDIA H100s on CoreWeave, parallelized variant generation, and cut time-to-best-result from 20 minutes to 5. That is the difference between a research demo and something a team can actually use.",
        "Against v0 and bolt.new on a held-out test set of 40 marketing-page mockups, CodeShot scored ~5% higher on visual similarity at the same time budget. The result took second place at the Inference-Time Compute Hackathon. Cognition Labs surfaced the project on X.",
      ],
    },
    {
      type: "imageScrub",
      src: "/codeshot.png",
      alt: "CodeShot architecture: design mockup feeds into agent loop with H100-backed renderer, candidate code variants are scored by visual similarity metric.",
      width: 2400,
      height: 1350,
    },
    {
      type: "links",
      links: [
        {
          text: "X announcement (Cognition Labs)",
          url: "https://x.com/cognition_labs/status/1896737373872103692",
          icon: "external",
        },
        {
          text: "Demo video",
          url: "https://www.youtube.com/watch?v=ib1SBuyamSY",
          icon: "youtube",
        },
      ],
    },
  ],
};
