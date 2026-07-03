"use client";

import Link from "next/link";
import { Github, Youtube, ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import type { Slot, LinkIcon } from "@/lib/case-studies";

const ICONS: Record<LinkIcon, React.ComponentType<{ className?: string }>> = {
  github: Github,
  youtube: Youtube,
  external: ExternalLink,
  paper: FileText,
};

interface LinksSlotProps {
  slot: Extract<Slot, { type: "links" }>;
}

export function LinksSlot({ slot }: LinksSlotProps) {
  if (slot.links.length === 0) return null;
  return (
    <section className="container-editorial py-16 md:py-24 hairline">
      <div className="eyebrow mb-6">Links</div>
      <div className="max-w-2xl flex flex-col">
        {slot.links.map((link) => {
          const Icon = link.icon ? ICONS[link.icon] : ExternalLink;
          return (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-3 text-sm border-b border-border py-4"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {link.text}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
