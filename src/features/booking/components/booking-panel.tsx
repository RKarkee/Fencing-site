"use client";

import { useState } from "react";
import type { Booking } from "@/lib/schemas";
import { BookingConfirmation } from "./booking-confirmation";
import { BookingForm, type BookingFormProps } from "./booking-form";

/** Full-page booking form that swaps to a confirmation once booked */
export function BookingPanel({ services, defaultValues }: Pick<BookingFormProps, "services" | "defaultValues">) {
  const [booking, setBooking] = useState<Booking | null>(null);

  if (booking) {
    return <BookingConfirmation booking={booking} serviceName={services.find((s) => s.slug === booking.serviceSlug)?.name} />;
  }
  return <BookingForm services={services} defaultValues={defaultValues} onBooked={setBooking} />;
}
