import type { Metadata } from "next";
import { Suspense, type ComponentProps } from "react";
import { FenceCalculator } from "@/features/calculator/components/fence-calculator";
import { content } from "@/lib/data";
import { getPageOrNotFound } from "@/lib/data/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { FaqSection } from "@/sections/faq";
import { SectionRenderer } from "@/sections/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageOrNotFound("calculator");
  return buildMetadata(page.seo, "/calculator");
}

export default async function CalculatorPage({ searchParams }: PageProps<"/calculator">) {
  const [page, services, pricing] = await Promise.all([getPageOrNotFound("calculator"), content.getServices(), content.getPricing()]);
  const serviceOptions = services.map(({ slug, name, shortName, icon }) => ({ slug, name, shortName, icon }));

  return (
    <>
      <SectionRenderer sections={page.sections} />
      <section className="container-page relative z-10 -mt-10 pb-8 sm:-mt-12">
        {/* Static shell renders instantly; only the ?service= preselection waits for the request */}
        <Suspense fallback={<FenceCalculator services={serviceOptions} pricing={pricing} />}>
          <CalculatorWithParams searchParams={searchParams} services={serviceOptions} pricing={pricing} />
        </Suspense>
      </section>
      <FaqSection section={{ type: "faq", eyebrow: "Pricing FAQs", heading: "About our prices", category: "pricing" }} />
    </>
  );
}

async function CalculatorWithParams({
  searchParams,
  ...props
}: { searchParams: PageProps<"/calculator">["searchParams"] } & Omit<ComponentProps<typeof FenceCalculator>, "initialService">) {
  const params = await searchParams;
  const initialService = typeof params.service === "string" ? params.service : undefined;
  return <FenceCalculator key={initialService} {...props} initialService={initialService} />;
}
