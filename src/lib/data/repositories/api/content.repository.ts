import { z } from "zod";
import {
  faqSchema,
  locationSchema,
  navigationSchema,
  pageSchema,
  pricingSchema,
  projectSchema,
  reviewSchema,
  serviceSchema,
  siteSchema,
  teamMemberSchema,
} from "@/lib/schemas";
import type { ContentRepository } from "../types";

/**
 * REST implementation of the same interface. Point CONTENT_API_URL at your backend
 * (Express, Nest, Laravel, a headless CMS…) that returns the same JSON shapes as /src/data.
 */
export function createApiContentRepository(baseUrl: string): ContentRepository {
  async function get<T extends z.ZodType>(path: string, schema: T): Promise<z.infer<T>> {
    const res = await fetch(`${baseUrl}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return schema.parse(await res.json());
  }

  async function getOrNull<T extends z.ZodType>(path: string, schema: T): Promise<z.infer<T> | null> {
    const res = await fetch(`${baseUrl}${path}`, { next: { revalidate: 300 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return schema.parse(await res.json());
  }

  return {
    getSite: () => get("/site", siteSchema),
    getNavigation: () => get("/navigation", navigationSchema),
    getPage: (slug) => getOrNull(`/pages/${slug}`, pageSchema),
    getServices: () => get("/services", z.array(serviceSchema)),
    getServiceBySlug: (slug) => getOrNull(`/services/${slug}`, serviceSchema),
    getPricing: () => get("/pricing", z.array(pricingSchema)),
    getLocations: () => get("/locations", z.array(locationSchema)),
    getLocationBySlug: (slug) => getOrNull(`/locations/${slug}`, locationSchema),
    getReviews: () => get("/reviews", z.array(reviewSchema)),
    getProjects: () => get("/projects", z.array(projectSchema)),
    getProjectBySlug: (slug) => getOrNull(`/projects/${slug}`, projectSchema),
    getFaqs: () => get("/faqs", z.array(faqSchema)),
    getTeam: () => get("/team", z.array(teamMemberSchema)),
  };
}
