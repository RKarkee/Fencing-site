import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, tone = "dark" }: { items: { name: string; path: string }[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", tone === "dark" ? "text-muted" : "text-white/60")}>
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            {i === items.length - 1 ? (
              <span aria-current="page" className={tone === "dark" ? "text-ink" : "text-white"}>
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="hover:underline">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
