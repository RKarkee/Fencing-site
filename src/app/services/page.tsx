import type { Metadata } from "next";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "@/sections/section-renderer";

/** Fully driven by src/data/pages/services.json */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("services");
  return buildMetadata(page.seo, "/services");
}

export default async function ServicesPage() {
  const page = await getPageOrNotFound("services");
  return <SectionRenderer sections={page.sections} />;
}
