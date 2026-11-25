import { Check, Star } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { SmartImage } from "@/components/ui/smart-image";
import { content } from "@/lib/data";
import type { SectionOf } from "@/lib/schemas";

export async function HeroSection({ section }: { section: SectionOf<"hero"> }) {
  const site = await content.getSite();

  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
        <div className="animate-fade-up">
          {section.eyebrow && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-700/15 bg-sage-100 px-3.5 py-1.5 text-xs font-semibold text-forest-700">
              <span className="size-1.5 rounded-full bg-forest-600" aria-hidden />
              {section.eyebrow}
            </p>
          )}
          <h1 className="text-[2.75rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.4rem]">
            {section.heading}{" "}
            {section.highlight && (
              <span className="relative whitespace-nowrap text-forest-700">
                {section.highlight}
                <svg viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full text-ochre-500" aria-hidden preserveAspectRatio="none">
                  <path d="M2 9c60-6 140-8 296-4" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </h1>
          {section.subheading && <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{section.subheading}</p>}

          <div className="mt-9 flex flex-wrap gap-3">
            {section.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} />
            ))}
          </div>

          {section.badges.length > 0 && (
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
              {section.badges.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm font-medium text-ink/75">
                  <Check className="size-4 text-forest-600" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <SmartImage image={section.image} priority className="aspect-[4/5] rounded-[2rem] shadow-lift sm:aspect-[5/5] lg:aspect-[4/5]" />

          {/* Floating rating card */}
          <div className="absolute -left-4 bottom-8 rounded-2xl bg-white p-4 shadow-lift sm:-left-8">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-sand-100 font-display text-lg font-bold">G</div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-3.5 fill-ochre-500 text-ochre-500" aria-hidden />
                  ))}
                </div>
                <p className="mt-0.5 text-sm font-semibold">
                  {site.rating.value} from {site.rating.count} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Floating quote card */}
          <div className="absolute -right-3 top-8 hidden rounded-2xl bg-forest-900 p-4 text-white shadow-lift sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-400">Free measures</p>
            <p className="mt-1 font-display text-lg font-semibold">Available this week</p>
          </div>
        </div>
      </div>
    </section>
  );
}
