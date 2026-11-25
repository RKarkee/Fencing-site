import type { SectionOf } from "@/lib/schemas";

export function StatsSection({ section }: { section: SectionOf<"stats"> }) {
  return (
    <section className="container-page">
      <dl className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-ink/8 bg-white shadow-soft lg:grid-cols-4">
        {section.items.map((item, i) => (
          <div
            key={item.label}
            className={`px-6 py-7 text-center sm:py-9 ${i % 2 === 0 ? "border-r border-ink/8" : ""} ${i < 2 ? "border-b border-ink/8 lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
          >
            <dt className="sr-only">{item.label}</dt>
            <dd className="font-display text-3xl font-bold text-forest-800 sm:text-4xl">{item.value}</dd>
            <dd className="mt-1 text-sm font-medium text-muted">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
