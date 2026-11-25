import type { Faq, Location, Pricing, Service, Site } from "@/lib/schemas";

type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function localBusinessJsonLd(site: Site): JsonLdObject[] {
  return site.offices.map((office) => ({
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#${office.id}`,
    name: `${site.name} — ${office.name}`,
    url: site.url,
    telephone: office.phoneE164,
    email: site.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: office.street,
      addressLocality: office.suburb,
      addressRegion: office.state,
      postalCode: office.postcode,
      addressCountry: "AU",
    },
    geo: { "@type": "GeoCoordinates", latitude: office.geo.lat, longitude: office.geo.lng },
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count },
  }));
}

export function serviceJsonLd(site: Site, service: Service, pricing?: Pricing): JsonLdObject {
  const installed = pricing?.options.find((o) => o.type === "installed");
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    serviceType: service.name,
    provider: { "@type": "HomeAndConstructionBusiness", name: site.name, url: site.url },
    areaServed: ["Perth WA", "South West WA"],
    ...(installed && {
      offers: { "@type": "Offer", priceCurrency: "AUD", price: installed.from, description: `From $${installed.from} per ${installed.unit}, GST incl.` },
    }),
  };
}

export function locationJsonLd(site: Site, location: Location): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${site.name} — ${location.name}`,
    url: `${site.url}/locations/${location.slug}`,
    areaServed: location.suburbs.map((s) => ({ "@type": "Place", name: `${s} WA` })),
  };
}

export function faqJsonLd(faqs: Faq[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function breadcrumbJsonLd(site: Site, items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${site.url}${item.path}` })),
  };
}
