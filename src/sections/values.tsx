import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SectionOf } from "@/lib/schemas";

export function ValuesSection({ section }: { section: SectionOf<"values"> }) {
  return (
    <section className="container-page section-y">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} align="center" />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item) => (
          <div key={item.title} className="rounded-[var(--radius-card)] border border-ink/8 bg-white p-7 shadow-soft">
            <span className="grid size-12 place-items-center rounded-2xl bg-sage-100 text-forest-700">
              <Icon name={item.icon} className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
