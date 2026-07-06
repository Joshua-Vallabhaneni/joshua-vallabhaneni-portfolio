import { ChevronDown } from "lucide-react";

const engagements = [
  {
    title: "Ayni AI (Anya)",
    client: "For Head of Marketing at Metaverse",
    date: "Oct 2025",
    description:
      "An all-in-one, AI-powered studio management platform. An AI co-writer learns an instructor's voice from uploads and generates editable pose sequences, and a built-in content studio automates promo graphics, video, and narration — alongside a student CRM, messaging, scheduling, and revenue analytics.",
    stack: ["React", "TypeScript", "FastAPI", "LangChain", "OpenAI API", "PostgreSQL"],
    id: "ayni",
  },
  {
    title: "SpatialSnap",
    client: "For a VC syndicate lead",
    date: "Feb 2026",
    description:
      "A point-and-click AI pipeline that turns objects in 2D photos into production-ready 3D assets — synthesizing unmirrored orthogonal views of the target and reconstructing them into a textured mesh in the cloud. Headless Blender renders each candidate, and an AI structural judge picks the most accurate model against the original photo.",
    stack: ["Python", "Google GenAI SDK", "Tripo 3D API", "Blender API", "NumPy"],
    id: "spatialsnap",
  },
  {
    title: "P&N Electronics",
    client: "For two business owners",
    date: "Apr 2026",
    description:
      "An operations platform for an IT asset management and e-waste recycling business. Customers submit quote requests to sell used electronics and browse a live refurbished storefront, while an admin dashboard handles submission review, hardware evaluation, inventory, and email workflows in one hub.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Resend"],
    id: "pnelectronics",
  },
];

export default function Freelance() {
  return (
    <section id="freelance" className="py-12 md:py-14">
      <div className="container-editorial">
        <h2 className="eyebrow mb-2">Paid freelance</h2>
        <ol>
          {engagements.map((item) => (
            <li
              key={item.id}
              id={`freelance-${item.id}`}
              className="border-l border-border pl-5 mt-4 first:mt-2"
            >
              <details className="group">
                <summary className="cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                      {item.date}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180 group-hover:text-foreground" />
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.client}</p>
                </summary>
                <div className="pb-5 -mt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <p className="mt-3 text-xs font-mono text-muted-foreground/80">
                    {item.stack.join(" · ")}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
