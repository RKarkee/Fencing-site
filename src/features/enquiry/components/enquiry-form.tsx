"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/field";
import { enquiryInputSchema, type EnquiryInput } from "@/lib/schemas";
import { useCreateEnquiry } from "../hooks/use-create-enquiry";

type FormInput = z.input<typeof enquiryInputSchema>;

const types: { value: EnquiryInput["type"]; label: string }[] = [
  { value: "residential", label: "Residential install" },
  { value: "commercial", label: "Commercial / tender" },
  { value: "diy-supply", label: "DIY supplies" },
  { value: "other", label: "Something else" },
];

export function EnquiryForm({ defaultType }: { defaultType?: EnquiryInput["type"] }) {
  const createEnquiry = useCreateEnquiry();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, EnquiryInput>({
    resolver: zodResolver(enquiryInputSchema),
    defaultValues: { type: defaultType ?? "residential" },
  });

  const onSubmit = handleSubmit((values) => createEnquiry.mutate(values, { onSuccess: () => reset() }));

  if (createEnquiry.isSuccess) {
    return (
      <div className="rounded-[var(--radius-card)] bg-sage-100 p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-forest-700" aria-hidden />
        <p className="mt-4 font-display text-2xl font-bold">Thanks — message received</p>
        <p className="mt-2 text-ink/75">We reply to every enquiry within one business day.</p>
        <p className="mt-3 inline-block rounded-full bg-white px-3 py-1 font-mono text-xs font-semibold">
          Ref {createEnquiry.data.enquiry.reference}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="eq-name" error={errors.name?.message}>
          <input id="eq-name" autoComplete="name" className={inputClasses} aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="eq-email" error={errors.email?.message}>
          <input id="eq-email" type="email" autoComplete="email" className={inputClasses} aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Phone (optional)" htmlFor="eq-phone" error={errors.phone?.message}>
          <input id="eq-phone" type="tel" autoComplete="tel" className={inputClasses} {...register("phone")} />
        </Field>
        <Field label="Enquiry type" htmlFor="eq-type">
          <select id="eq-type" className={inputClasses} {...register("type")}>
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message" htmlFor="eq-message" error={errors.message?.message}>
        <textarea id="eq-message" rows={5} className={inputClasses} aria-invalid={!!errors.message} {...register("message")} />
      </Field>
      {createEnquiry.isError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {createEnquiry.error.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={createEnquiry.isPending}>
        {createEnquiry.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        Send message
      </Button>
    </form>
  );
}
