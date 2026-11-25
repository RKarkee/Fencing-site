import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { ReviewCard } from "@/features/reviews/components/review-card";
import { content } from "@/lib/data";
import type { SectionOf } from "@/lib/schemas";

export async function ReviewsSection({ section }: { section: SectionOf<"reviews"> }) {
  const [reviews, site] = await Promise.all([content.getReviews(), content.getSite()]);

  return (
    <section className="bg-sand-100">
      <div className="container-page section-y">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
          <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-soft">
            <span className="font-display text-4xl font-bold">{site.rating.value}</span>
            <div>
              <Stars rating={site.rating.value} />
              <p className="mt-1 text-sm text-muted">
                {site.rating.count} {site.rating.source} reviews
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, section.limit).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
