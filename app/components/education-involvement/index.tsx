import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface InvolvementItem {
  position: string;
  organization: string;
  period: string;
  highlights: string[];
  link?: { text: string; url: string };
}

const involvement: InvolvementItem[] = [
  {
    position: "Machine Learning Researcher",
    organization: "UMD Department of Computer Science",
    period: "2025 — Present",
    highlights: [
      "Working on deep learning models for protein fold classification under Dr. Fardina Alam. Received the CSBW 2025 Best Paper Award.",
    ],
    link: {
      text: "Read the publication",
      url: "https://dl.acm.org/doi/10.1145/3768322.3769023",
    },
  },
  {
    position: "Data Science TA",
    organization: "University of Maryland",
    period: "Spring 2026",
    highlights: [
      "Taught GVPT201, covering statistical inference, regression, and data analysis in R.",
    ],
  },
];

export default function EducationInvolvement() {
  return (
    <section id="education" className="py-12 md:py-14">
      <div className="container-editorial">
        <h2 className="eyebrow mb-2">Education</h2>

        <div className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4 gap-y-0.5">
            <span className="font-medium">University of Maryland, College Park</span>
            <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
              Grad in December 2027
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            B.S. Computer Science (ML track), minor in Data Science.
          </p>
        </div>

        <ol className="divide-y divide-border border-t border-border">
          {involvement.map((item) => (
            <li key={item.position} className="py-5">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4 gap-y-0.5">
                <div>
                  <span className="font-medium">{item.position}</span>
                  <span className="text-muted-foreground"> · {item.organization}</span>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                  {item.period}
                </span>
              </div>
              {item.highlights.map((h) => (
                <p key={h} className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {h}
                </p>
              ))}
              {item.link && (
                <Link
                  href={item.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium link-underline"
                >
                  {item.link.text}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
