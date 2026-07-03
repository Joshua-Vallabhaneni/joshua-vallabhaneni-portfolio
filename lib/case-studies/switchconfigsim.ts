import type { CaseStudy } from "./index";

export const switchconfigsim: CaseStudy = {
  slug: "switchconfigsim",
  slots: [
    {
      type: "hero",
      title: "SwitchConfigSim",
      eyebrow: "2025 · PayPal infrastructure project",
      tags: ["Go", "Shell", "REST APIs", "OpenAPI", "Linux", "Makefile"],
      summary:
        "A network switch management interface that mirrors enterprise-grade infrastructure patterns, with dual interfaces — CLI and REST API — that both execute identical backend automation.",
    },
    {
      type: "narrative",
      paragraphs: [
        "Network engineers and platform teams want different ergonomics for the same job. Engineers want a CLI that reads like the real switch console; platform teams want a REST API they can wire into automation. The hardest part is making sure those two surfaces never drift — that the CLI and the API genuinely run the same backend and produce the same effects.",
        "SwitchConfigSim is structured around a single Go core that exposes both a Cobra-style CLI and a generated OpenAPI server. Every state-changing operation routes through the same automation script, so adding a new command means writing it once and getting both surfaces for free. The OpenAPI spec is the contract; the CLI is generated from the same handlers the API exposes.",
        "The simulator runs against virtualized switch images on Linux, which means the same workflow that drives the test harness can be pointed at a real device with no code change. That is the part that makes this useful inside a large org: it collapses the gap between a learning environment and a production runbook.",
      ],
    },
    {
      type: "imageScrub",
      src: "/switchconfig.png",
      alt: "SwitchConfigSim CLI and REST API panels side by side, both calling the same Go backend handlers.",
      width: 2400,
      height: 1350,
    },
    {
      type: "video",
      videoId: "GsN7T22HNzc",
      title: "SwitchConfigSim demo",
    },
    {
      type: "links",
      links: [
        {
          text: "GitHub",
          url: "https://github.com/Joshua-Vallabhaneni/SwitchConfigSim",
          icon: "github",
        },
      ],
    },
  ],
};
