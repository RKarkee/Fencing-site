import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarClock, FileText, Ruler } from "lucide-react";
import { BookingPanel } from "@/features/booking/components/booking-panel";
import { content } from "@/lib/data";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "@/sections/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("book");
  return buildMetadata(page.seo, "/book");
}

const steps = [
  { icon: CalendarClock, title: "Pick a time", text: "Morning or afternoon windows, usually within 3 business days." },
  { icon: Ruler, title: "We measure", text: "An estimator checks boundaries, levels and access, and shows you samples." },
  { icon: FileText, title: "Fixed quote in 48h", text: "Itemised, GST-inclusive and valid for 30 days. No obligation." },
];

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const [page, services] = await Promise.all([getPageOrNotFound("book"), content.getServices()]);
  const serviceOptions = services.map((s) => ({ slug: s.slug, name: s.name }));

  return (
    <>
      <SectionRenderer sections={page.sections} />
      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr]">
        <ol className="space-y-4">
          {steps.map(({ icon: StepIcon, title, text }, i) => (
            <li key={title} className="flex gap-4 rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-soft">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sage-100 text-forest-700">
                <StepIcon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ochre-600">Step {i + 1}</p>
                <p className="font-display text-lg font-bold">{title}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-lift sm:p-9">
          <Suspense fallback={<BookingPanel services={serviceOptions} />}>
            <BookingPanelWithParams searchParams={searchParams} services={serviceOptions} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function BookingPanelWithParams({
  searchParams,
  services,
}: {
  searchParams: PageProps<"/book">["searchParams"];
  services: { slug: string; name: string }[];
}) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;
  return <BookingPanel services={services} defaultValues={service ? { serviceSlug: service } : undefined} />;
}
