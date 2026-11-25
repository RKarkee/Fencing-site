import { z } from "zod";

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1, "Every image needs alt text"),
});
export type ImageAsset = z.infer<typeof imageSchema>;

export const ctaSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
  /** "open-chat" opens the AI assistant, optionally with a starter prompt */
  action: z.enum(["link", "open-chat", "call"]).default("link"),
  prompt: z.string().optional(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("primary"),
});
export type Cta = z.infer<typeof ctaSchema>;

export const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
});
export type Seo = z.infer<typeof seoSchema>;

export const regionSchema = z.enum(["perth", "south-west"]);
export type Region = z.infer<typeof regionSchema>;
