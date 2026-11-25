import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("size-4", i < Math.round(rating) ? "fill-ochre-500 text-ochre-500" : "fill-sand-200 text-sand-200")}
          aria-hidden
        />
      ))}
    </div>
  );
}
