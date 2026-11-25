import { z } from "zod";
import { imageSchema, regionSchema, seoSchema } from "./common";

export const locationSchema = z.object({
  slug: z.string(),
  name: z.string(),
  region: regionSchema,
  officeId: z.string(),
  intro: z.string(),
  suburbs: z.array(z.string()),
  leadTime: z.string(),
  image: imageSchema,
  seo: seoSchema,
});
export type Location = z.infer<typeof locationSchema>;

export const reviewSchema = z.object({
  id: z.string(),
  author: z.string(),
  suburb: z.string(),
  rating: z.number().min(1).max(5),
  date: z.string(),
  serviceSlug: z.string(),
  title: z.string(),
  body: z.string(),
  source: z.enum(["Google", "Facebook", "Direct"]),
});
export type Review = z.infer<typeof reviewSchema>;

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  suburb: z.string(),
  serviceSlug: z.string(),
  length: z.string(),
  duration: z.string(),
  completed: z.string(),
  summary: z.string(),
  challenge: z.string(),
  outcome: z.string(),
  image: imageSchema,
  gallery: z.array(imageSchema).default([]),
});
export type Project = z.infer<typeof projectSchema>;

export const faqSchema = z.object({
  id: z.string(),
  category: z.enum(["general", "pricing", "pool", "booking", "diy", "commercial"]),
  question: z.string(),
  answer: z.string(),
});
export type Faq = z.infer<typeof faqSchema>;

export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  years: z.number(),
  initials: z.string(),
});
export type TeamMember = z.infer<typeof teamMemberSchema>;
