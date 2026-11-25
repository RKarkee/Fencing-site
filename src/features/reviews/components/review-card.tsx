import { Quote } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import type { Review } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-ink/8 bg-white p-7 shadow-soft">
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <Quote className="size-6 text-sage-200" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg font-bold">{review.title}</h3>
      <blockquote className="mt-2 flex-1 leading-relaxed text-ink/75">{review.body}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/8 pt-5">
        <span className="grid size-10 place-items-center rounded-full bg-sage-100 font-display text-sm font-bold text-forest-700">
          {review.author.charAt(0)}
        </span>
        <span className="text-sm">
          <span className="block font-semibold">{review.author}</span>
          <span className="text-muted">
            {review.suburb} · {formatDate(review.date, { month: "short", year: "numeric" })} · {review.source}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
