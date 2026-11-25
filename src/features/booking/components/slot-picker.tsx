"use client";

import { Loader2 } from "lucide-react";
import type { Region, Slot } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useAvailability } from "../hooks/use-booking";

type Props = { region: Region; value?: string; onChange: (slotId: string) => void; compact?: boolean };

function groupByDate(slots: Slot[]) {
  const map = new Map<string, Slot[]>();
  for (const slot of slots) map.set(slot.date, [...(map.get(slot.date) ?? []), slot]);
  return [...map.entries()];
}

export function SlotPicker({ region, value, onChange, compact }: Props) {
  const { data: slots, isPending, isError, refetch } = useAvailability(region);

  if (isPending)
    return (
      <p className="flex items-center gap-2 py-4 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" aria-hidden /> Checking the estimator calendar…
      </p>
    );
  if (isError)
    return (
      <button type="button" onClick={() => refetch()} className="py-3 text-sm font-semibold text-ochre-600 underline">
        Couldn&apos;t load times — try again
      </button>
    );

  const days = groupByDate(slots).slice(0, compact ? 4 : 8);

  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4")} role="radiogroup" aria-label="Measure time">
      {days.map(([date, daySlots]) => (
        <div key={date} className="rounded-xl border border-ink/10 bg-white p-2">
          <p className="px-1 pb-1.5 text-xs font-bold text-ink">{daySlots[0].label.split(" · ")[0]}</p>
          <div className="grid gap-1">
            {daySlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                role="radio"
                aria-checked={value === slot.id}
                disabled={!slot.available}
                onClick={() => onChange(slot.id)}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-left text-xs font-semibold transition-colors",
                  !slot.available && "cursor-not-allowed text-ink/30 line-through",
                  slot.available && value !== slot.id && "bg-sand-50 text-ink/80 hover:bg-sage-100",
                  value === slot.id && "bg-forest-700 text-white",
                )}
              >
                {slot.window === "morning" ? "AM" : "PM"} · {slot.label.split(" · ")[1]}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
