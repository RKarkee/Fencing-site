import { Plus } from "lucide-react";
import type { Faq } from "@/lib/schemas";

/** Native <details> accordion — accessible, no JS needed */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-ink/8 rounded-[var(--radius-card)] border border-ink/8 bg-white shadow-soft">
      {faqs.map((faq) => (
        <details key={faq.id} id={faq.id} className="group scroll-mt-28 px-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-semibold">
            {faq.question}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sand-100 transition-transform duration-300 group-open:rotate-45 group-open:bg-ochre-500 group-open:text-white">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
