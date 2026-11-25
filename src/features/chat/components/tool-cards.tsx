"use client";

import { Calculator, Clock, Mail, Phone, X } from "lucide-react";
import { BookingConfirmation } from "@/features/booking/components/booking-confirmation";
import { BookingForm } from "@/features/booking/components/booking-form";
import type { Region } from "@/lib/schemas";
import { formatCurrency, unitLabel } from "@/lib/utils";
import type { AvailabilityOutput, BookingFormOutput, EstimateOutput, HandoffOutput } from "../types";

const card = "w-full rounded-2xl border border-ink/8 bg-white p-4 shadow-soft animate-pop";

type BookingInputPrefill = {
  serviceSlug?: string;
  region?: Region;
  suburb?: string;
  name?: string;
  phone?: string;
  approxLength?: number;
};

export function BookingCard({
  input,
  output,
  services,
  onResult,
}: {
  input?: BookingInputPrefill;
  output?: BookingFormOutput;
  services: { slug: string; name: string }[];
  onResult: (output: BookingFormOutput) => void;
}) {
  if (output?.status === "booked") {
    return (
      <BookingConfirmation
        compact
        booking={{ reference: output.reference, slotLabel: output.slotLabel, suburb: output.suburb, name: "" }}
        serviceName={services.find((s) => s.slug === output.serviceSlug)?.name}
      />
    );
  }
  if (output?.status === "dismissed") {
    return <p className="text-xs italic text-muted">Booking card closed.</p>;
  }

  return (
    <div className={card}>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display font-bold">Book your free measure</p>
        <button
          type="button"
          onClick={() => onResult({ status: "dismissed" })}
          className="grid size-7 place-items-center rounded-full text-muted hover:bg-sand-100"
          aria-label="Close booking card"
        >
          <X className="size-4" />
        </button>
      </div>
      <BookingForm
        compact
        services={services}
        defaultValues={{
          serviceSlug: input?.serviceSlug,
          region: input?.region ?? "perth",
          suburb: input?.suburb,
          name: input?.name,
          phone: input?.phone,
          approxLength: input?.approxLength,
        }}
        onBooked={(b) => onResult({ status: "booked", reference: b.reference, slotLabel: b.slotLabel, suburb: b.suburb, serviceSlug: b.serviceSlug })}
      />
    </div>
  );
}

export function EstimateCard({ output }: { output: EstimateOutput }) {
  if ("error" in output) return null;
  return (
    <div className="pickets w-full animate-pop rounded-2xl bg-forest-900 p-4 text-white">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sage-400">
        <Calculator className="size-3.5" aria-hidden /> Estimate · GST incl.
      </p>
      <p className="mt-1 font-display text-2xl font-bold">
        {formatCurrency(output.low)} – {formatCurrency(output.high)}
      </p>
      <p className="mt-1 text-xs text-white/65">
        {output.quantity}
        {output.unit === "lm" ? "m" : " ×"} {output.serviceName} · {output.variantLabel} · {formatCurrency(output.unitPrice)}
        {unitLabel(output.unit)} · {output.type === "installed" ? "installed" : "supply only"}
      </p>
      {output.yourShare && <p className="mt-2 text-sm font-semibold text-ochre-400">≈ {formatCurrency(output.yourShare)} your half</p>}
    </div>
  );
}

export function AvailabilityCard({ output, onPick }: { output: AvailabilityOutput; onPick: (label: string) => void }) {
  return (
    <div className={card}>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <Clock className="size-3.5" aria-hidden /> Next free measures
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {output.slots.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.label)}
            className="rounded-lg bg-sand-50 px-2.5 py-2 text-left text-xs font-semibold hover:bg-sage-100"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ContactCard({ output }: { output: HandoffOutput }) {
  return (
    <div className={`${card} space-y-3`}>
      {output.offices.map((o) => (
        <a key={o.name} href={`tel:${o.phoneE164}`} className="flex items-center justify-between gap-3 rounded-xl bg-sand-50 p-3 hover:bg-sage-100">
          <span>
            <span className="block text-sm font-semibold">{o.name}</span>
            <span className="text-xs text-muted">{o.hours[0]?.label} {o.hours[0]?.value}</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-forest-700">
            <Phone className="size-4" aria-hidden /> {o.phone}
          </span>
        </a>
      ))}
      <a href={`mailto:${output.commercialEmail}`} className="flex items-center gap-2 px-1 text-xs font-semibold text-forest-700 hover:underline">
        <Mail className="size-3.5" aria-hidden /> {output.commercialEmail} (commercial)
      </a>
    </div>
  );
}
