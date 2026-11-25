import type { Metadata } from "next";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "@/sections/section-renderer";

/** Fully driven by src/data/pages/about.json */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("about");
  return buildMetadata(page.seo, "/about");
}

export default async function AboutPage() {
  const page = await getPageOrNotFound("about");
  return <SectionRenderer sections={page.sections} />;
}
