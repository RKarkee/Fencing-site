import { CtaButton } from "@/components/cta-button";
import type { SectionOf } from "@/lib/schemas";

export function CtaBannerSection({ section }: { section: SectionOf<"cta-banner"> }) {
  return (
    <section className="container-page pb-20 sm:pb-28">
      <div className="pickets relative overflow-hidden rounded-[2rem] bg-forest-800 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-ochre-500/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-sage-400/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold leading-tight sm:text-5xl">{section.heading}</h2>
          {section.subheading && <p className="mt-5 text-lg text-white/75">{section.subheading}</p>}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {section.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} variant={cta.variant === "primary" ? "primary" : "outline-light"} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
