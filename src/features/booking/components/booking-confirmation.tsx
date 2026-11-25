import { CheckCircle2 } from "lucide-react";
import type { Booking } from "@/lib/schemas";

type Props = { booking: Pick<Booking, "reference" | "slotLabel" | "suburb" | "name">; serviceName?: string; compact?: boolean };

export function BookingConfirmation({ booking, serviceName, compact }: Props) {
  return (
    <div className={compact ? "rounded-2xl bg-sage-100 p-4" : "rounded-[var(--radius-card)] bg-sage-100 p-8 text-center"}>
      <CheckCircle2 className={compact ? "size-6 text-forest-700" : "mx-auto size-12 text-forest-700"} aria-hidden />
      <p className={compact ? "mt-2 font-display font-bold" : "mt-4 font-display text-2xl font-bold"}>
        You&apos;re booked{booking.name ? `, ${booking.name.split(" ")[0]}` : ""}!
      </p>
      <p className="mt-1 text-sm text-ink/75">
        {serviceName ? `${serviceName} measure` : "Free measure"} in {booking.suburb}
        <br />
        <strong>{booking.slotLabel}</strong>
      </p>
      <p className="mt-3 inline-block rounded-full bg-white px-3 py-1 font-mono text-xs font-semibold">Ref {booking.reference}</p>
    </div>
  );
}
