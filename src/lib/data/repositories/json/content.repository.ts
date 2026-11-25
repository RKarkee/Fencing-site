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
  type Page,
} from "@/lib/schemas";
import type { ContentRepository } from "../types";

import siteJson from "@/data/site.json";
import navigationJson from "@/data/navigation.json";
import servicesJson from "@/data/services.json";
import pricingJson from "@/data/pricing.json";
import locationsJson from "@/data/locations.json";
import reviewsJson from "@/data/reviews.json";
import projectsJson from "@/data/projects.json";
import faqsJson from "@/data/faqs.json";
import teamJson from "@/data/team.json";
import homePage from "@/data/pages/home.json";
import aboutPage from "@/data/pages/about.json";
import servicesPage from "@/data/pages/services.json";
import projectsPage from "@/data/pages/projects.json";
import locationsPage from "@/data/pages/locations.json";
import faqsPage from "@/data/pages/faqs.json";
import calculatorPage from "@/data/pages/calculator.json";
import contactPage from "@/data/pages/contact.json";
import bookPage from "@/data/pages/book.json";

/** Validates JSON once; a typo in a data file fails the build with a readable error. */
function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid data in ${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

const site = parse(siteSchema, siteJson, "site.json");
const navigation = parse(navigationSchema, navigationJson, "navigation.json");
const services = parse(z.array(serviceSchema), servicesJson, "services.json");
const pricing = parse(z.array(pricingSchema), pricingJson, "pricing.json");
const locations = parse(z.array(locationSchema), locationsJson, "locations.json");
const reviews = parse(z.array(reviewSchema), reviewsJson, "reviews.json")
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));
const projects = parse(z.array(projectSchema), projectsJson, "projects.json");
const faqs = parse(z.array(faqSchema), faqsJson, "faqs.json");
const team = parse(z.array(teamMemberSchema), teamJson, "team.json");

const pages = new Map<string, Page>(
  [homePage, aboutPage, servicesPage, projectsPage, locationsPage, faqsPage, calculatorPage, contactPage, bookPage].map(
    (page) => {
      const parsed = parse(pageSchema, page, `pages/${(page as { slug: string }).slug}.json`);
      return [parsed.slug, parsed];
    },
  ),
);

export function createJsonContentRepository(): ContentRepository {
  return {
    getSite: async () => site,
    getNavigation: async () => navigation,
    getPage: async (slug) => pages.get(slug) ?? null,
    getServices: async () => services,
    getServiceBySlug: async (slug) => services.find((s) => s.slug === slug) ?? null,
    getPricing: async () => pricing,
    getLocations: async () => locations,
    getLocationBySlug: async (slug) => locations.find((l) => l.slug === slug) ?? null,
    getReviews: async () => reviews,
    getProjects: async () => projects,
    getProjectBySlug: async (slug) => projects.find((p) => p.slug === slug) ?? null,
    getFaqs: async () => faqs,
    getTeam: async () => team,
  };
}
