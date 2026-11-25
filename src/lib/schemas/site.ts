import { z } from "zod";

export const officeSchema = z.object({
  id: z.string(),
  name: z.string(),
  street: z.string(),
  suburb: z.string(),
  state: z.string(),
  postcode: z.string(),
  phone: z.string(),
  /** E.164 format so tel: links always work */
  phoneE164: z.string().regex(/^\+\d+$/),
  hours: z.array(z.object({ label: z.string(), value: z.string() })),
  note: z.string().optional(),
  geo: z.object({ lat: z.number(), lng: z.number() }),
});
export type Office = z.infer<typeof officeSchema>;

export const siteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  abn: z.string(),
  licence: z.string(),
  email: z.string().email(),
  commercialEmail: z.string().email(),
  foundedYear: z.number(),
  rating: z.object({ value: z.number(), count: z.number(), source: z.string() }),
  offices: z.array(officeSchema).min(1),
  socials: z.array(z.object({ label: z.string(), href: z.string().url() })),
  announcement: z
    .object({ enabled: z.boolean(), text: z.string(), href: z.string().optional() })
    .optional(),
});
export type Site = z.infer<typeof siteSchema>;

const navLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  description: z.string().optional(),
});

export const navigationSchema = z.object({
  main: z.array(
    navLinkSchema.extend({
      children: z.array(navLinkSchema).optional(),
    }),
  ),
  footer: z.array(z.object({ title: z.string(), links: z.array(navLinkSchema) })),
  legal: z.array(navLinkSchema),
});
export type Navigation = z.infer<typeof navigationSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
