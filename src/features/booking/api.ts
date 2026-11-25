import type { Booking, BookingInput, Enquiry, EnquiryInput, Region, Slot } from "@/lib/schemas";

/** Thin fetch client for our own route handlers — swap base URL to talk to an external API */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error ?? "Something went wrong. Please try again.");
  return body as T;
}

export const bookingApi = {
  availability: (region: Region) => request<{ slots: Slot[] }>(`/api/availability?region=${region}`),
  create: (input: BookingInput) => request<{ booking: Booking }>("/api/bookings", { method: "POST", body: JSON.stringify(input) }),
};

export const enquiryApi = {
  create: (input: EnquiryInput) => request<{ enquiry: Enquiry }>("/api/enquiries", { method: "POST", body: JSON.stringify(input) }),
};
