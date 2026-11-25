import { SmartImage } from "@/components/ui/smart-image";
import type { SectionOf } from "@/lib/schemas";

export function PageHeaderSection({ section }: { section: SectionOf<"page-header"> }) {
  return (
    <section className="pickets relative overflow-hidden bg-forest-900 text-white">
      {section.image && (
        <>
          <SmartImage image={section.image} priority className="absolute inset-0 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-900/90 to-forest-900/40" aria-hidden />
        </>
      )}
      <div className="container-page relative py-20 sm:py-24">
        <div className="max-w-3xl animate-fade-up">
          {section.eyebrow && (
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ochre-400">
              <span className="h-px w-6 bg-current" />
              {section.eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">{section.heading}</h1>
          {section.subheading && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{section.subheading}</p>}
        </div>
      </div>
    </section>
  );
}
