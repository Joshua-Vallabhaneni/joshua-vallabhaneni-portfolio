"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies";
import { HeroSlot } from "./slots/HeroSlot";
import { NarrativeSlot } from "./slots/NarrativeSlot";
import { ImageScrubSlot } from "./slots/ImageScrubSlot";
import { VideoSlot } from "./slots/VideoSlot";
import { LinksSlot } from "./slots/LinksSlot";

interface CaseStudyViewProps {
  data: CaseStudy;
}

export function CaseStudyView({ data }: CaseStudyViewProps) {
  return (
    <article className="pt-32 pb-40">
      <div className="container-editorial mb-12">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to work
        </Link>
      </div>
      {data.slots.map((slot, i) => {
        switch (slot.type) {
          case "hero":
            return <HeroSlot key={i} slot={slot} />;
          case "narrative":
            return <NarrativeSlot key={i} slot={slot} />;
          case "imageScrub":
            return <ImageScrubSlot key={i} slot={slot} />;
          case "video":
            return <VideoSlot key={i} slot={slot} />;
          case "links":
            return <LinksSlot key={i} slot={slot} />;
        }
      })}
    </article>
  );
}
