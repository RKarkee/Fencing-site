import type { MetadataRoute } from "next";
import { content } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await content.getSite();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
