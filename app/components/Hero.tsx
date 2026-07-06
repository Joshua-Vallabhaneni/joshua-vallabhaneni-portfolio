import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="pt-24 md:pt-28 pb-6 md:pb-8">
      <div className="container-editorial animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">
          Joshua Vallabhaneni
        </h1>
        <p className="mt-1 text-muted-foreground">
          Engineer &amp; ML researcher
        </p>

        <p className="mt-8 leading-relaxed text-foreground/80">
          I study CS and Data Science at the University of Maryland.
          Currently a software engineering intern at Oracle and an ML researcher
          at UMD, incoming at Amazon this fall; previously at PayPal and
          AstraZeneca.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pjvallabhaneni@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline-reveal inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Email
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/Joshua-Vallabhaneni"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline-reveal inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            GitHub
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href="https://linkedin.com/in/joshua-vallabhaneni"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline-reveal inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            LinkedIn
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
