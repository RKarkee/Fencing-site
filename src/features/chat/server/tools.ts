import "server-only";
import { tool, type InferUITools } from "ai";
import { z } from "zod";
import { createEnquiry, getAvailability } from "@/lib/booking/service";
import { content } from "@/lib/data";
import { estimatePrice } from "@/lib/pricing/estimate";
import { regionSchema } from "@/lib/schemas";

const serviceSlugs = [
  "colorbond-fencing",
  "pool-fencing",
  "pvc-fencing",
  "aluminium-slat-fencing",
  "blade-fencing",
  "security-fencing",
  "retaining-walls",
  "gates-automation",
] as const;
const serviceSlugSchema = z.enum(serviceSlugs);

/** Result the browser sends back after the customer submits (or dismisses) the booking card */
export const bookingFormOutputSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("booked"), reference: z.string(), slotLabel: z.string(), suburb: z.string(), serviceSlug: z.string() }),
  z.object({ status: z.literal("dismissed") }),
]);

/**
 * Tools the assistant can call. Every tool reads from the same repositories as the website,
 * so the bot can never quote a price that differs from the site.
 */
export const chatTools = {
  getServiceInfo: tool({
    description: "Look up details, specs, warranty and prices for one fence type, or list all fence types if no slug is given.",
    inputSchema: z.object({ serviceSlug: serviceSlugSchema.optional() }),
    execute: async ({ serviceSlug }) => {
      const [services, pricing] = await Promise.all([content.getServices(), content.getPricing()]);
      const list = serviceSlug ? services.filter((s) => s.slug === serviceSlug) : services;
      return list.map((s) => ({
        slug: s.slug,
        name: s.name,
        summary: s.summary,
        ...(serviceSlug && { features: s.features, specs: s.specs, installTime: s.installTime, warranty: s.warranty }),
        pricing: pricing.find((p) => p.serviceSlug === s.slug)?.options.map((o) => ({ type: o.type, from: o.from, unit: o.unit, gstIncluded: o.gstIncluded })),
        url: `/services/${s.slug}`,
      }));
    },
  }),

  estimatePrice: tool({
    description:
      "Calculate an indicative price range. Use whenever the customer asks what something costs and you know the fence type and rough length (metres) or number of gates.",
    inputSchema: z.object({
      serviceSlug: serviceSlugSchema,
      quantity: z.number().min(1).describe("Length in metres, or number of gates for gates-automation"),
      type: z.enum(["installed", "supply-only"]).default("installed"),
      removeOldFence: z.boolean().default(false),
      splitWithNeighbour: z.boolean().default(false),
    }),
    execute: async (input) => {
      const pricing = await content.getPricing();
      const services = await content.getServices();
      const estimate = estimatePrice(pricing, input);
      if (!estimate) return { error: "No pricing for that fence type" };
      return { ...estimate, serviceName: services.find((s) => s.slug === input.serviceSlug)?.name ?? input.serviceSlug };
    },
  }),

  checkAvailability: tool({
    description: "Get the next available free-measure appointment windows for a region.",
    inputSchema: z.object({ region: regionSchema }),
    execute: async ({ region }) => {
      const slots = await getAvailability(region);
      return { region, slots: slots.filter((s) => s.available).slice(0, 6) };
    },
  }),

  showBookingForm: tool({
    description:
      "Show the customer an interactive booking card to confirm a FREE on-site measure & quote. Pre-fill anything you already know. Never claim a booking is made until this tool returns status 'booked'.",
    inputSchema: z.object({
      serviceSlug: serviceSlugSchema.optional(),
      region: regionSchema.optional(),
      suburb: z.string().optional(),
      name: z.string().optional(),
      phone: z.string().optional(),
      approxLength: z.number().optional(),
    }),
    outputSchema: bookingFormOutputSchema,
    // No execute: the browser renders the form and returns the result via addToolOutput
  }),

  createEnquiry: tool({
    description:
      "Send a written enquiry to the office (commercial jobs, DIY supply orders, complex questions). Only call after the customer has given their name and email AND confirmed the message summary.",
    inputSchema: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      type: z.enum(["residential", "commercial", "diy-supply", "other"]),
      message: z.string().min(10),
    }),
    execute: async (input) => {
      const enquiry = await createEnquiry(input);
      return { reference: enquiry.reference };
    },
  }),

  handoffToHuman: tool({
    description: "Give the customer direct contact details when they want a person, are unhappy, or the request is outside what you can do.",
    inputSchema: z.object({ reason: z.string() }),
    execute: async () => {
      const site = await content.getSite();
      return {
        offices: site.offices.map((o) => ({ name: o.name, phone: o.phone, phoneE164: o.phoneE164, hours: o.hours })),
        email: site.email,
        commercialEmail: site.commercialEmail,
      };
    },
  }),
};

export type ChatTools = InferUITools<typeof chatTools>;
