"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/field";
import { bookingInputSchema, type Booking } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "../hooks/use-booking";
import { SlotPicker } from "./slot-picker";

type FormInput = z.input<typeof bookingInputSchema>;
type FormOutput = z.output<typeof bookingInputSchema>;

export type BookingFormProps = {
  services: { slug: string; name: string }[];
  defaultValues?: Partial<FormInput>;
  onBooked?: (booking: Booking) => void;
  /** Tighter layout for use inside the chat panel */
  compact?: boolean;
};

export function BookingForm({ services, defaultValues, onBooked, compact }: BookingFormProps) {
  const createBooking = useCreateBooking();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(bookingInputSchema),
    defaultValues: { region: "perth", serviceSlug: services[0]?.slug, slotId: "", ...defaultValues },
  });
  const region = useWatch({ control, name: "region" });

  const onSubmit = handleSubmit((values) => {
    createBooking.mutate(values, { onSuccess: ({ booking }) => onBooked?.(booking) });
  });

  const grid = compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className={grid}>
        <Field label="Your name" htmlFor="bk-name" error={errors.name?.message}>
          <input id="bk-name" autoComplete="name" className={inputClasses} aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Mobile" htmlFor="bk-phone" error={errors.phone?.message}>
          <input id="bk-phone" type="tel" autoComplete="tel" placeholder="04xx xxx xxx" className={inputClasses} aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
        {!compact && (
          <Field label="Email (optional)" htmlFor="bk-email" error={errors.email?.message}>
            <input id="bk-email" type="email" autoComplete="email" className={inputClasses} {...register("email")} />
          </Field>
        )}
        <Field label="Job suburb" htmlFor="bk-suburb" error={errors.suburb?.message}>
          <input id="bk-suburb" autoComplete="address-level2" className={inputClasses} aria-invalid={!!errors.suburb} {...register("suburb")} />
        </Field>
        <Field label="Fence type" htmlFor="bk-service" error={errors.serviceSlug?.message}>
          <select id="bk-service" className={inputClasses} {...register("serviceSlug")}>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Approx. length (m)" htmlFor="bk-length" hint="A rough guess is fine" error={errors.approxLength?.message}>
          <input id="bk-length" type="number" inputMode="numeric" min={1} className={inputClasses} {...register("approxLength")} />
        </Field>
      </div>

      <Field label="Area" error={errors.region?.message}>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["perth", "Perth metro"],
              ["south-west", "South West"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setValue("region", value);
                setValue("slotId", "");
              }}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                region === value ? "border-forest-700 bg-forest-700 text-white" : "border-ink/12 bg-white hover:border-ink/30",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Pick a measure time" error={errors.slotId?.message}>
        <Controller
          control={control}
          name="slotId"
          render={({ field }) => <SlotPicker region={region ?? "perth"} value={field.value} onChange={field.onChange} compact={compact} />}
        />
      </Field>

      {!compact && (
        <Field label="Anything we should know?" htmlFor="bk-notes" hint="Access, pets, slope, colour ideas…">
          <textarea id="bk-notes" rows={3} className={inputClasses} {...register("notes")} />
        </Field>
      )}

      {createBooking.isError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {createBooking.error.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={createBooking.isPending}>
        {createBooking.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CalendarCheck className="size-4" aria-hidden />}
        Confirm free measure
      </Button>
      <p className="text-center text-xs text-muted">No obligation · we&apos;ll SMS a reminder the day before</p>
    </form>
  );
}
