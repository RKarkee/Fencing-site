import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { SmartImage } from "@/components/ui/smart-image";
import { FaqList } from "@/features/faq/components/faq-list";
import { ProjectCard } from "@/features/projects/components/project-card";
import { PricingPanel } from "@/features/services/components/pricing-panel";
import { ServiceCard } from "@/features/services/components/service-card";
import { content } from "@/lib/data";
import { fromPrice } from "@/lib/pricing/estimate";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { CtaBannerSection } from "@/sections/cta-banner";

export async function generateStaticParams() {
  const services = await content.getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await content.getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({ ...service.seo, image: service.image.src }, `/services/${slug}`);
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, site, pricing, faqs, projects, services] = await Promise.all([
    content.getServiceBySlug(slug),
    content.getSite(),
    content.getPricing(),
    content.getFaqs(),
    content.getProjects(),
    content.getServices(),
  ]);
  if (!service) notFound();

  const servicePricing = pricing.find((p) => p.serviceSlug === service.slug);
  const relatedFaqs = faqs.filter((f) => service.faqIds.includes(f.id));
  const relatedProjects = projects.filter((p) => p.serviceSlug === service.slug).slice(0, 2);
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Fencing", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(site, service, servicePricing),
          breadcrumbJsonLd(site, crumbs),
          ...(relatedFaqs.length ? [faqJsonLd(relatedFaqs)] : []),
        ]}
      />

      <section className="container-page grid gap-10 pb-16 pt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        <div className="animate-fade-up">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-6xl">{service.name}</h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{service.summary}</p>
          <SmartImage image={service.image} priority className="mt-9 aspect-[16/10] rounded-[2rem] shadow-lift" />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start lg:pt-16">
          {servicePricing && <PricingPanel service={service} pricing={servicePricing} />}
        </div>
      </section>

      <section className="container-page grid gap-12 pb-20 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        <div>
          <div className="space-y-5 text-lg leading-relaxed text-ink/80">
            {service.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <h2 className="mt-12 text-2xl font-bold">What&apos;s included</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="rounded-2xl border border-ink/8 bg-white p-4 font-medium shadow-soft">
                {f}
              </li>
            ))}
          </ul>
          {service.gallery.length > 0 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {service.gallery.map((img) => (
                <SmartImage key={img.src} image={img} className="aspect-[4/3] rounded-3xl" />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-5">
          <div className="rounded-[var(--radius-card)] bg-forest-900 p-7 text-white">
            <h2 className="text-xl font-bold">Specifications</h2>
            <dl className="mt-4 divide-y divide-white/10">
              {service.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-white/60">{s.label}</dt>
                  <dd className="text-right font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex gap-4 rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-soft">
            <Clock className="size-6 shrink-0 text-ochre-600" aria-hidden />
            <div>
              <p className="font-semibold">Install time</p>
              <p className="text-sm text-muted">{service.installTime}</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-soft">
            <ShieldCheck className="size-6 shrink-0 text-forest-600" aria-hidden />
            <div>
              <p className="font-semibold">Warranty</p>
              <p className="text-sm text-muted">{service.warranty}</p>
            </div>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="bg-sand-100">
          <div className="container-page section-y">
            <SectionHeading eyebrow="Recent work" heading={`${service.shortName} projects`} />
            <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} serviceName={service.shortName} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedFaqs.length > 0 && (
        <section className="container-page section-y grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQs" heading={`${service.shortName} questions`} />
          <FaqList faqs={relatedFaqs} />
        </section>
      )}

      <section className="container-page pb-20">
        <SectionHeading eyebrow="Explore" heading="Other fencing we build" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((s) => (
            <ServiceCard key={s.slug} service={s} installed={fromPrice(pricing, s.slug, "installed")} />
          ))}
        </div>
      </section>

      <CtaBannerSection
        section={{
          type: "cta-banner",
          heading: `Get a fixed price on your ${service.shortName.toLowerCase()} fence`,
          subheading: "Free on-site measure, written quote within 48 hours, no obligation.",
          ctas: [
            { label: "Book a free measure", action: "open-chat", prompt: `I'd like to book a free measure for ${service.name.toLowerCase()}`, variant: "primary" },
            { label: "Try the calculator", href: `/calculator?service=${service.slug}`, action: "link", variant: "ghost" },
          ],
        }}
      />
    </>
  );
}
