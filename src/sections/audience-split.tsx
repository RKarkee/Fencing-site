import { CtaButton } from "@/components/cta-button";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SectionOf } from "@/lib/schemas";

export function AudienceSplitSection({ section }: { section: SectionOf<"audience-split"> }) {
  return (
    <section className="container-page section-y">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} align="center" />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {section.items.map((item, i) => (
          <article
            key={item.title}
            className={`group flex flex-col rounded-[var(--radius-card)] p-8 transition-all duration-300 hover:-translate-y-1 ${
              i === 0 ? "pickets bg-forest-800 text-white shadow-lift" : "border border-ink/8 bg-white shadow-soft hover:shadow-lift"
            }`}
          >
            <div className={`grid size-12 place-items-center rounded-2xl ${i === 0 ? "bg-white/10 text-ochre-400" : "bg-sage-100 text-forest-700"}`}>
              <Icon name={item.icon} className="size-6" />
            </div>
            <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>
            <p className={`mt-3 flex-1 leading-relaxed ${i === 0 ? "text-white/75" : "text-muted"}`}>{item.description}</p>
            {item.cta && (
              <div className="mt-7">
                <CtaButton cta={item.cta} size="md" variant={i === 0 ? "primary" : "ghost"} />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
