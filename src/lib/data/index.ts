import "server-only";
import { createApiContentRepository } from "./repositories/api/content.repository";
import { createJsonContentRepository } from "./repositories/json/content.repository";
import {
  createMemoryBookingRepository,
  createMemoryEnquiryRepository,
} from "./repositories/memory/booking.repository";
import type { BookingRepository, ContentRepository, EnquiryRepository } from "./repositories/types";

/**
 * The ONLY place that decides where data comes from.
 * DATA_SOURCE=json (default) → /src/data/*.json
 * DATA_SOURCE=api            → CONTENT_API_URL
 */
function resolveContentRepository(): ContentRepository {
  if (process.env.DATA_SOURCE === "api") {
    const url = process.env.CONTENT_API_URL;
    if (!url) throw new Error("DATA_SOURCE=api requires CONTENT_API_URL");
    return createApiContentRepository(url);
  }
  return createJsonContentRepository();
}

export const content: ContentRepository = resolveContentRepository();
export const bookings: BookingRepository = createMemoryBookingRepository();
export const enquiries: EnquiryRepository = createMemoryEnquiryRepository();

export type { ContentRepository, BookingRepository, EnquiryRepository };
