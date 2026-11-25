import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { content } from "@/lib/data";
import type { SectionOf } from "@/lib/schemas";

export async function LocationsSection({ section }: { section: SectionOf<"locations"> }) {
  const locations = await content.getLocations();

  return (
    <section className="container-page section-y">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {locations.map((loc) => (
          <Link
            key={loc.slug}
            href={`/locations/${loc.slug}`}
            className="group rounded-[var(--radius-card)] border border-ink/8 bg-white p-7 shadow-soft transition-all hover:-translate-y-0.5 hover:border-forest-600/30 hover:shadow-lift"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ochre-600">
                  {loc.region === "perth" ? "Perth crews" : "South West depot"}
                </p>
                <h3 className="mt-1 text-2xl font-bold">{loc.name}</h3>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand-100 transition-colors group-hover:bg-ochre-500 group-hover:text-white">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{loc.suburbs.slice(0, 7).join(" · ")} and more</p>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-forest-700">
              <Clock className="size-4" aria-hidden /> {loc.leadTime}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
