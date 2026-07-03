import { redirect } from "next/navigation";
import { CASE_STUDIES } from "@/lib/case-studies";
import { CaseStudyView } from "./CaseStudy";

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const data = CASE_STUDIES[params.slug];
  if (!data) redirect("/#work");
  return <CaseStudyView data={data} />;
}
