import type { Region, Slot } from "@/lib/schemas";

/** Weekdays an estimator works in each region (0 = Sunday) */
const REGION_DAYS: Record<Region, number[]> = {
  perth: [1, 2, 3, 4, 5],
  "south-west": [2, 4],
};

const WINDOWS = [
  { window: "morning", label: "8am – 12pm" },
  { window: "afternoon", label: "12pm – 4pm" },
] as const;

/** Small deterministic hash so the demo looks "busy" but stays stable between requests */
function pseudoTaken(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10 < 3;
}

const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Generates measure slots for the next `days` working days.
 * Swap this for a calendar / ServiceM8 lookup later — the Slot shape stays the same.
 */
export function generateSlots(region: Region, from = new Date(), days = 8): Slot[] {
  const slots: Slot[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  cursor.setUTCDate(cursor.getUTCDate() + 1); // earliest is tomorrow

  let added = 0;
  while (added < days) {
    if (REGION_DAYS[region].includes(cursor.getUTCDay())) {
      const date = toIsoDate(cursor);
      const dayLabel = new Intl.DateTimeFormat("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(cursor);
      for (const w of WINDOWS) {
        const id = `${region}:${date}:${w.window}`;
        slots.push({ id, date, window: w.window, label: `${dayLabel} · ${w.label}`, available: !pseudoTaken(id) });
      }
      added++;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots;
}

export function findSlot(slotId: string): Slot | null {
  const [region, date, window] = slotId.split(":");
  if (!region || !date || !window) return null;
  const slot = generateSlots(region as Region, new Date(new Date(date).getTime() - 86_400_000), 1).find((s) => s.id === slotId);
  return slot ?? null;
}
