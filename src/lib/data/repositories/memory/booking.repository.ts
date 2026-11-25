import type { Booking, BookingInput, Enquiry, EnquiryInput } from "@/lib/schemas";
import type { BookingRepository, EnquiryRepository } from "../types";

/**
 * In-memory store for the prototype. Data resets when the server restarts.
 * Production: implement the same interface with Postgres, Supabase or the ServiceM8 API.
 */
type Store = { bookings: Booking[]; enquiries: Enquiry[] };

const globalStore = globalThis as unknown as { __saltbushStore?: Store };
const store: Store = (globalStore.__saltbushStore ??= { bookings: [], enquiries: [] });

function reference(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function createMemoryBookingRepository(): BookingRepository {
  return {
    async create(input: BookingInput, slotLabel: string) {
      const booking: Booking = {
        ...input,
        id: crypto.randomUUID(),
        reference: reference("SB"),
        status: "confirmed",
        slotLabel,
        createdAt: new Date().toISOString(),
      };
      store.bookings.push(booking);
      return booking;
    },
    async list() {
      return [...store.bookings].reverse();
    },
    async isSlotTaken(slotId, region) {
      return store.bookings.some((b) => b.slotId === slotId && b.region === region);
    },
  };
}

export function createMemoryEnquiryRepository(): EnquiryRepository {
  return {
    async create(input: EnquiryInput) {
      const enquiry: Enquiry = {
        ...input,
        id: crypto.randomUUID(),
        reference: reference("EQ"),
        createdAt: new Date().toISOString(),
      };
      store.enquiries.push(enquiry);
      return enquiry;
    },
  };
}
