import type { MetadataRoute } from "next";
import { content } from "@/lib/data";

/** Generated from the same JSON as the pages — new services/locations appear automatically */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, services, locations, projects] = await Promise.all([
    content.getSite(),
    content.getServices(),
    content.getLocations(),
    content.getProjects(),
  ]);
  const staticPaths = ["", "/services", "/projects", "/locations", "/calculator", "/about", "/faqs", "/contact", "/book"];
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, priority: 0.9 })),
    ...locations.map((l) => ({ url: `${site.url}/locations/${l.slug}`, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, priority: 0.5 })),
  ];
}
