interface ExperienceItem {
  company: string;
  period: string;
  role: string;
  id: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "Amazon",
    period: "Sep — Nov 2026",
    role: "Incoming Software Engineer Intern",
    id: "amazon",
  },
  {
    company: "Oracle",
    period: "May — Aug 2026",
    role: "Software Engineer Intern",
    id: "oracle",
  },
  {
    company: "PayPal",
    period: "May — Aug 2025",
    role: "Software Engineer Intern",
    id: "paypal",
  },
  {
    company: "AstraZeneca · Evinova",
    period: "May 2024 — May 2025",
    role: "Software Engineer I",
    id: "astrazeneca",
  },
  {
    company: "CATS2",
    period: "May — Aug 2024",
    role: "Human–Computer Interaction Intern",
    id: "cats2",
  },
  {
    company: "Proxzar.AI",
    period: "Jun — Aug 2022",
    role: "Software Engineer Intern",
    id: "proxzar",
  },
  {
    company: "United Safety & Survivability Corp.",
    period: "Jun — Aug 2021",
    role: "Engineer Intern",
    id: "unitedsafety",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-12 md:py-14">
      <div className="container-editorial">
        <h2 className="eyebrow mb-2">Experience</h2>
        <ol className="divide-y divide-border">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              id={`experience-${exp.id}`}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4 gap-y-0.5 py-4"
            >
              <div>
                <span className="font-medium">{exp.company}</span>
                <span className="text-muted-foreground"> · {exp.role}</span>
              </div>
              <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                {exp.period}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
