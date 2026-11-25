import { SectionHeading } from "@/components/ui/section-heading";
import type { SectionOf } from "@/lib/schemas";

export function ProcessSection({ section }: { section: SectionOf<"process"> }) {
  return (
    <section className="pickets bg-forest-900 text-white">
      <div className="container-page section-y">
        <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} tone="light" />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {section.steps.map((step, i) => (
            <li key={step.title} className="bg-forest-900 p-8">
              <span className="font-display text-5xl font-extrabold text-ochre-500/90">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-white/70">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
