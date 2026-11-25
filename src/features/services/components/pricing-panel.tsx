import Link from "next/link";
import { Calculator, Check, Minus } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import type { Pricing, Service } from "@/lib/schemas";
import { formatCurrency, unitLabel } from "@/lib/utils";

/** The one place a service's prices are displayed — always labelled installed vs supply-only, GST stated */
export function PricingPanel({ service, pricing }: { service: Service; pricing: Pricing }) {
  return (
    <aside className="rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-lift sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{service.name} pricing</p>
      <div className="mt-4 space-y-4">
        {pricing.options.map((option) => (
          <div key={option.type} className="rounded-2xl bg-sand-50 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold">{option.type === "installed" ? "Supplied & installed" : "Supply only (DIY)"}</p>
              <p className="font-display text-2xl font-bold text-forest-800">
                <span className="text-sm font-medium text-muted">from </span>
                {formatCurrency(option.from)}
                <span className="text-sm font-medium text-muted">{unitLabel(option.unit)}</span>
              </p>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {option.includes.map((inc) => (
                <li key={inc} className="flex gap-2 text-ink/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-forest-600" aria-hidden /> {inc}
                </li>
              ))}
              {option.excludes.map((exc) => (
                <li key={exc} className="flex gap-2 text-muted">
                  <Minus className="mt-0.5 size-4 shrink-0" aria-hidden /> {exc}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">
        All prices include GST. {pricing.notes ?? "Final price confirmed in your fixed written quote."}
      </p>
      <div className="mt-6 grid gap-2">
        <CtaButton
          cta={{
            label: "Book a free measure",
            action: "open-chat",
            prompt: `I'd like to book a free measure for ${service.name.toLowerCase()}`,
            variant: "primary",
          }}
          size="lg"
          className="w-full"
        />
        <Link
          href={`/calculator?service=${service.slug}`}
          className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-forest-700 hover:bg-sage-100"
        >
          <Calculator className="size-4" aria-hidden /> Estimate my {service.shortName.toLowerCase()} fence
        </Link>
      </div>
    </aside>
  );
}
