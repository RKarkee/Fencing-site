import type { Metadata } from "next";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "@/sections/section-renderer";

/** Fully driven by src/data/pages/projects.json */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("projects");
  return buildMetadata(page.seo, "/projects");
}

export default async function ProjectsPage() {
  const page = await getPageOrNotFound("projects");
  return <SectionRenderer sections={page.sections} />;
}
