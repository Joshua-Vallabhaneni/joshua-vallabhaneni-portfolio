import { codeshot } from "./codeshot";
import { switchconfigsim } from "./switchconfigsim";
import { eduplanner } from "./eduplanner";

export type LinkIcon = "github" | "youtube" | "external" | "paper";

export type Slot =
  | {
      type: "hero";
      title: string;
      eyebrow: string;
      tags: string[];
      summary: string;
    }
  | { type: "narrative"; paragraphs: string[] }
  | { type: "imageScrub"; src: string; alt: string; width: number; height: number }
  | { type: "video"; videoId: string; title: string }
  | {
      type: "links";
      links: Array<{ text: string; url: string; icon?: LinkIcon }>;
    };

export interface CaseStudy {
  slug: string;
  slots: Slot[];
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  codeshot,
  switchconfigsim,
  eduplanner,
};

export const CASE_STUDY_SLUGS = new Set(Object.keys(CASE_STUDIES));
