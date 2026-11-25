import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SmartImage } from "@/components/ui/smart-image";
import { content } from "@/lib/data";
import { estimatePrice } from "@/lib/pricing/estimate";
import type { SectionOf } from "@/lib/schemas";
import { formatCurrency } from "@/lib/utils";

export async function CalculatorTeaserSection({ section }: { section: SectionOf<"calculator-teaser"> }) {
  const pricing = await content.getPricing();
  const sample = estimatePrice(pricing, { serviceSlug: "colorbond-fencing", type: "installed", quantity: 30, splitWithNeighbour: true });

  return (
    <section className="container-page section-y">
      <div className="grid items-center gap-12 overflow-hidden rounded-[2rem] bg-sage-100 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
        <div>
          <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
          <ul className="mt-7 space-y-3">
            {section.points.map((p) => (
              <li key={p} className="flex items-center gap-3 font-medium">
                <span className="grid size-6 place-items-center rounded-full bg-forest-700 text-white">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <ButtonLink href="/calculator" size="lg" className="mt-9">
            Open the calculator <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>

        <div className="relative">
          <SmartImage image={section.image} className="aspect-[4/3] rounded-3xl" />
          {sample && (
            <div className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-white p-5 shadow-lift sm:left-auto sm:right-6 sm:w-72">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Example · 30m Colorbond 1.8m</p>
              <p className="mt-1 font-display text-3xl font-bold text-forest-800">
                {formatCurrency(sample.low)}–{formatCurrency(sample.high)}
              </p>
              {sample.yourShare && (
                <p className="mt-1 text-sm text-muted">≈ {formatCurrency(sample.yourShare)} your half with a neighbour split</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
