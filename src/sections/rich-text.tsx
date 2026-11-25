import { SectionHeading } from "@/components/ui/section-heading";
import { SmartImage } from "@/components/ui/smart-image";
import type { SectionOf } from "@/lib/schemas";

export function RichTextSection({ section }: { section: SectionOf<"rich-text"> }) {
  return (
    <section className="container-page section-y">
      <div className={`grid items-center gap-12 ${section.image ? "lg:grid-cols-2" : ""}`}>
        <div>
          <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/75">
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        {section.image && <SmartImage image={section.image} className="aspect-[5/4] rounded-[2rem] shadow-lift" />}
      </div>
    </section>
  );
}
