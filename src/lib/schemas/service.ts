import { z } from "zod";
import { imageSchema, seoSchema } from "./common";

export const serviceSchema = z.object({
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  category: z.enum(["residential", "pool", "commercial", "gates", "landscape"]),
  icon: z.string(),
  summary: z.string(),
  description: z.array(z.string()).min(1),
  features: z.array(z.string()),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  installTime: z.string(),
  warranty: z.string(),
  image: imageSchema,
  gallery: z.array(imageSchema).default([]),
  faqIds: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  seo: seoSchema,
});
export type Service = z.infer<typeof serviceSchema>;

export const pricingOptionSchema = z.object({
  type: z.enum(["installed", "supply-only"]),
  unit: z.enum(["lm", "each", "m2"]),
  from: z.number().positive(),
  gstIncluded: z.boolean(),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
});
export type PricingOption = z.infer<typeof pricingOptionSchema>;

/** Single source of truth for every price on the site, the calculator and the chatbot */
export const pricingSchema = z.object({
  serviceSlug: z.string(),
  options: z.array(pricingOptionSchema).min(1),
  heightOptions: z
    .array(z.object({ label: z.string(), multiplier: z.number() }))
    .default([{ label: "Standard", multiplier: 1 }]),
  notes: z.string().optional(),
});
export type Pricing = z.infer<typeof pricingSchema>;
