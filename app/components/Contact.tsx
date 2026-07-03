"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { SectionProgressHairline } from "./motion/SectionProgressHairline";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} id="contact" className="relative py-24 md:py-40">
      <SectionProgressHairline sectionRef={sectionRef} />
      <div className="container-editorial">
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
        >
          Get in touch
        </motion.p>

        <motion.div
          className="grid grid-cols-12 gap-x-6 gap-y-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="col-span-12 md:col-span-6">
            <a
              href="mailto:pjvallabhaneni@gmail.com"
              className="group inline-flex items-baseline gap-2 text-2xl md:text-4xl font-medium tracking-tight"
            >
              <span className="link-underline">pjvallabhaneni@gmail.com</span>
              <ArrowUpRight className="h-5 w-5 md:h-8 md:w-8 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <p className="mt-4 text-muted-foreground max-w-md">
              I&rsquo;m open to internships, research collaborations and freelance projects.
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <div className="eyebrow mb-2">Based in</div>
              <div className="text-base">College Park, Maryland</div>
            </div>
            <div>
              <div className="eyebrow mb-2">Timezone</div>
              <div className="text-base">EST (UTC−5)</div>
            </div>
            <div>
              <div className="eyebrow mb-2">Elsewhere</div>
              <ul className="space-y-1.5 text-base">
                <li>
                  <a
                    href="https://github.com/Joshua-Vallabhaneni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 link-underline-reveal"
                  >
                    GitHub
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/joshua-vallabhaneni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 link-underline-reveal"
                  >
                    LinkedIn
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
