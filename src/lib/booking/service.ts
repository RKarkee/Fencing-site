import "server-only";
import { bookings, enquiries } from "@/lib/data";
import { bookingInputSchema, enquiryInputSchema, type Region } from "@/lib/schemas";
import { findSlot, generateSlots } from "./availability";

export class BookingError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/** Slots with real bookings filtered out — used by the API route and the chatbot */
export async function getAvailability(region: Region) {
  const slots = generateSlots(region);
  const checked = await Promise.all(
    slots.map(async (slot) => ({
      ...slot,
      available: slot.available && !(await bookings.isSlotTaken(slot.id, region)),
    })),
  );
  return checked;
}

export async function createBooking(raw: unknown) {
  const input = bookingInputSchema.parse(raw);
  const slot = findSlot(input.slotId);
  if (!slot || !slot.available) throw new BookingError("That time isn't available any more — please pick another.", 409);
  if (await bookings.isSlotTaken(input.slotId, input.region)) {
    throw new BookingError("Someone just booked that time — please pick another.", 409);
  }
  return bookings.create(input, slot.label);
}

export async function createEnquiry(raw: unknown) {
  const input = enquiryInputSchema.parse(raw);
  return enquiries.create(input);
}
