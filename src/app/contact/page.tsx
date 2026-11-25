import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "@/features/enquiry/components/enquiry-form";
import { content } from "@/lib/data";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "@/sections/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("contact");
  return buildMetadata(page.seo, "/contact");
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const [page, site] = await Promise.all([getPageOrNotFound("contact"), content.getSite()]);

  return (
    <>
      <SectionRenderer sections={page.sections} />
      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          {site.offices.map((office) => (
            <div key={office.id} className="rounded-[var(--radius-card)] border border-ink/8 bg-white p-7 shadow-soft">
              <h2 className="text-xl font-bold">{office.name}</h2>
              <ul className="mt-4 space-y-3 text-[15px]">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-ochre-600" aria-hidden />
                  {office.street}, {office.suburb} {office.state} {office.postcode}
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-ochre-600" aria-hidden />
                  <a href={`tel:${office.phoneE164}`} className="font-semibold hover:underline">
                    {office.phone}
                  </a>
                </li>
                {office.hours.map((h) => (
                  <li key={h.label} className="flex gap-3 text-muted">
                    <Clock className="mt-0.5 size-4 shrink-0 text-ochre-600" aria-hidden />
                    {h.label}: {h.value}
                  </li>
                ))}
                {office.note && <li className="pl-7 text-sm text-muted">{office.note}</li>}
              </ul>
            </div>
          ))}
          <div className="pickets rounded-[var(--radius-card)] bg-forest-900 p-7 text-white">
            <h2 className="text-xl font-bold">Commercial & tenders</h2>
            <p className="mt-2 text-white/70">Send drawings and specs straight to our commercial team.</p>
            <a href={`mailto:${site.commercialEmail}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-ochre-400 hover:underline">
              <Mail className="size-4" aria-hidden /> {site.commercialEmail}
            </a>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-lift sm:p-9">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 mb-6 text-muted">Want a measure booked straight away? Use the chat assistant or the booking page instead.</p>
          <Suspense fallback={<EnquiryForm />}>
            <EnquiryFormWithParams searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function EnquiryFormWithParams({ searchParams }: { searchParams: PageProps<"/contact">["searchParams"] }) {
  const params = await searchParams;
  return <EnquiryForm defaultType={params.type === "commercial" ? "commercial" : undefined} />;
}
