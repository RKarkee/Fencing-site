import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SmartImage } from "@/components/ui/smart-image";
import { content } from "@/lib/data";
import { breadcrumbJsonLd, JsonLd, locationJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ReviewsSection } from "@/sections/reviews";
import { ServiceGridSection } from "@/sections/service-grid";

export async function generateStaticParams() {
  const locations = await content.getLocations();
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const location = await content.getLocationBySlug(slug);
  if (!location) return {};
  return buildMetadata(location.seo, `/locations/${slug}`);
}

export default async function LocationPage({ params }: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const [location, site] = await Promise.all([content.getLocationBySlug(slug), content.getSite()]);
  if (!location) notFound();
  const office = site.offices.find((o) => o.id === location.officeId) ?? site.offices[0];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service areas", path: "/locations" },
    { name: location.name, path: `/locations/${location.slug}` },
  ];

  return (
    <>
      <JsonLd data={[locationJsonLd(site, location), breadcrumbJsonLd(site, crumbs)]} />
      <section className="pickets relative overflow-hidden bg-forest-900 text-white">
        <SmartImage image={location.image} priority className="absolute inset-0 opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-900/90 to-transparent" aria-hidden />
        <div className="container-page relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Breadcrumbs items={crumbs} tone="light" />
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-6xl">Fencing in {location.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{location.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton
                cta={{ label: "Book a free measure", action: "open-chat", prompt: `I'd like to book a free measure in ${location.name}`, variant: "primary" }}
              />
              <CtaButton cta={{ label: `Call ${office.phone}`, action: "call", href: `tel:${office.phoneE164}`, variant: "ghost" }} variant="outline-light" />
            </div>
          </div>
          <div className="self-end rounded-[var(--radius-card)] bg-white p-6 text-ink shadow-lift">
            <p className="font-display text-lg font-bold">{office.name}</p>
            <p className="mt-3 flex gap-2 text-sm text-muted">
              <MapPin className="size-4 shrink-0 text-ochre-600" aria-hidden />
              {office.street}, {office.suburb} {office.postcode}
            </p>
            <p className="mt-2 flex gap-2 text-sm text-muted">
              <Phone className="size-4 shrink-0 text-ochre-600" aria-hidden />
              {office.phone}
            </p>
            <p className="mt-2 flex gap-2 text-sm text-muted">
              <Clock className="size-4 shrink-0 text-ochre-600" aria-hidden />
              {location.leadTime}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page pt-16">
        <h2 className="text-2xl font-bold">Suburbs we cover</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {location.suburbs.map((s) => (
            <li key={s} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <ServiceGridSection section={{ type: "service-grid", eyebrow: location.name, heading: `Fencing we install in ${location.name}`, showPrices: true }} />
      <ReviewsSection section={{ type: "reviews", eyebrow: "Local reviews", heading: "What WA homeowners say", limit: 3 }} />
    </>
  );
}
