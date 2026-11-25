import { z } from "zod";
import { ctaSchema, imageSchema, seoSchema } from "./common";

const headingFields = {
  eyebrow: z.string().optional(),
  heading: z.string(),
  subheading: z.string().optional(),
};

const iconItem = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  cta: ctaSchema.optional(),
});

/**
 * Every page is a list of sections. Add a section by:
 * 1. adding a schema here, 2. building the component in /sections, 3. registering it in sections/registry.tsx
 */
export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    ...headingFields,
    highlight: z.string().optional(),
    image: imageSchema,
    ctas: z.array(ctaSchema).default([]),
    badges: z.array(z.string()).default([]),
  }),
  z.object({
    type: z.literal("page-header"),
    ...headingFields,
    image: imageSchema.optional(),
  }),
  z.object({
    type: z.literal("stats"),
    items: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
  z.object({
    type: z.literal("audience-split"),
    ...headingFields,
    items: z.array(iconItem),
  }),
  z.object({
    type: z.literal("service-grid"),
    ...headingFields,
    category: z.string().optional(),
    limit: z.number().optional(),
    showPrices: z.boolean().default(true),
  }),
  z.object({
    type: z.literal("process"),
    ...headingFields,
    steps: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
  z.object({
    type: z.literal("reviews"),
    ...headingFields,
    limit: z.number().default(6),
  }),
  z.object({
    type: z.literal("projects"),
    ...headingFields,
    limit: z.number().default(3),
  }),
  z.object({
    type: z.literal("calculator-teaser"),
    ...headingFields,
    points: z.array(z.string()).default([]),
    image: imageSchema,
  }),
  z.object({
    type: z.literal("faq"),
    ...headingFields,
    category: z.string().optional(),
    limit: z.number().optional(),
  }),
  z.object({
    type: z.literal("locations"),
    ...headingFields,
  }),
  z.object({
    type: z.literal("values"),
    ...headingFields,
    items: z.array(iconItem),
  }),
  z.object({
    type: z.literal("rich-text"),
    ...headingFields,
    paragraphs: z.array(z.string()),
    image: imageSchema.optional(),
  }),
  z.object({
    type: z.literal("team"),
    ...headingFields,
  }),
  z.object({
    type: z.literal("cta-banner"),
    ...headingFields,
    ctas: z.array(ctaSchema).default([]),
  }),
]);
export type Section = z.infer<typeof sectionSchema>;
export type SectionType = Section["type"];
export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;

export const pageSchema = z.object({
  slug: z.string(),
  seo: seoSchema,
  sections: z.array(sectionSchema),
});
export type Page = z.infer<typeof pageSchema>;
