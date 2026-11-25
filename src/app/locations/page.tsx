import type { Metadata } from "next";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "@/sections/section-renderer";

/** Fully driven by src/data/pages/locations.json */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("locations");
  return buildMetadata(page.seo, "/locations");
}

export default async function LocationsPage() {
  const page = await getPageOrNotFound("locations");
  return <SectionRenderer sections={page.sections} />;
}
