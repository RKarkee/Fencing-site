import type { Metadata } from "next";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "@/sections/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("home");
  return buildMetadata(page.seo, "/");
}

export default async function HomePage() {
  const page = await getPageOrNotFound("home");
  return <SectionRenderer sections={page.sections} />;
}
