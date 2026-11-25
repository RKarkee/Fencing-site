import { SectionHeading } from "@/components/ui/section-heading";
import { content } from "@/lib/data";
import type { SectionOf } from "@/lib/schemas";

export async function TeamSection({ section }: { section: SectionOf<"team"> }) {
  const team = await content.getTeam();
  return (
    <section className="container-page section-y">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m) => (
          <article key={m.id} className="rounded-[var(--radius-card)] border border-ink/8 bg-white p-7 shadow-soft">
            <div className="pickets grid size-16 place-items-center rounded-2xl bg-forest-800 font-display text-xl font-bold text-white">
              {m.initials}
            </div>
            <h3 className="mt-5 text-lg font-bold">{m.name}</h3>
            <p className="text-sm font-semibold text-ochre-600">{m.role}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{m.bio}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">{m.years} years in fencing</p>
          </article>
        ))}
      </div>
    </section>
  );
}
