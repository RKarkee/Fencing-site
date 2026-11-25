import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/features/services/components/service-card";
import { content } from "@/lib/data";
import { fromPrice } from "@/lib/pricing/estimate";
import type { SectionOf } from "@/lib/schemas";

export async function ServiceGridSection({ section }: { section: SectionOf<"service-grid"> }) {
  const [services, pricing] = await Promise.all([content.getServices(), content.getPricing()]);
  const list = services
    .filter((s) => !section.category || s.category === section.category)
    .slice(0, section.limit ?? services.length);

  return (
    <section className="container-page section-y">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((service) => {
          const installed = fromPrice(pricing, service.slug, "installed");
          const supply = fromPrice(pricing, service.slug, "supply-only");
          return (
            <ServiceCard
              key={service.slug}
              service={service}
              installed={installed}
              supply={supply?.type === "supply-only" ? supply : null}
              showPrices={section.showPrices}
            />
          );
        })}
      </div>
    </section>
  );
}
