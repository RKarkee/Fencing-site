import { z } from "zod";
import { regionSchema } from "./common";

export const slotSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date, e.g. 2026-12-02
  window: z.enum(["morning", "afternoon"]),
  label: z.string(),
  available: z.boolean(),
});
export type Slot = z.infer<typeof slotSchema>;

const auPhone = z
  .string()
  .trim()
  .regex(/^(\+?61|0)[2-478](\s?\d){8}$/, "Enter a valid Australian phone number");

/** Shared by the booking form, the chatbot and POST /api/bookings */
export const bookingInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: auPhone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  suburb: z.string().trim().min(2, "Which suburb is the job in?"),
  region: regionSchema,
  serviceSlug: z.string().min(1, "Choose a fence type"),
  /** Empty input → undefined (z.coerce would turn "" into 0 and fail) */
  approxLength: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().min(1, "Enter a length in metres").max(2000).optional(),
  ),
  slotId: z.string().min(1, "Pick a time for the measure"),
  notes: z.string().max(1000).optional(),
});
export type BookingInput = z.infer<typeof bookingInputSchema>;

export const bookingSchema = bookingInputSchema.extend({
  id: z.string(),
  reference: z.string(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  slotLabel: z.string(),
  createdAt: z.string(),
});
export type Booking = z.infer<typeof bookingSchema>;

export const enquiryInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: auPhone.optional().or(z.literal("")),
  type: z.enum(["residential", "commercial", "diy-supply", "other"]),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
});
export type EnquiryInput = z.infer<typeof enquiryInputSchema>;

export const enquirySchema = enquiryInputSchema.extend({
  id: z.string(),
  reference: z.string(),
  createdAt: z.string(),
});
export type Enquiry = z.infer<typeof enquirySchema>;
