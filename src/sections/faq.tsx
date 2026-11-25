import { SectionHeading } from "@/components/ui/section-heading";
import { FaqList } from "@/features/faq/components/faq-list";
import { content } from "@/lib/data";
import type { SectionOf } from "@/lib/schemas";
import { faqJsonLd, JsonLd } from "@/lib/seo/json-ld";

export async function FaqSection({ section }: { section: SectionOf<"faq"> }) {
  const all = await content.getFaqs();
  const faqs = all.filter((f) => !section.category || f.category === section.category).slice(0, section.limit ?? all.length);

  return (
    <section className="container-page section-y">
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
}
