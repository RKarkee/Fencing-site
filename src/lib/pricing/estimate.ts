import type { Pricing, PricingOption } from "@/lib/schemas";

export type EstimateInput = {
  serviceSlug: string;
  type: PricingOption["type"];
  /** Linear metres for fences, number of gates for "each" pricing */
  quantity: number;
  variantIndex?: number;
  removeOldFence?: boolean;
  splitWithNeighbour?: boolean;
};

export type Estimate = {
  serviceSlug: string;
  type: PricingOption["type"];
  unit: PricingOption["unit"];
  quantity: number;
  variantLabel: string;
  unitPrice: number;
  removal: number;
  total: number;
  low: number;
  high: number;
  yourShare: number | null;
  gstIncluded: boolean;
  includes: string[];
  excludes: string[];
};

const REMOVAL_PER_LM = 15;

/**
 * Pure function shared by the calculator UI, the chatbot tool and the demo assistant,
 * so every price on the site comes from the same maths and the same pricing.json.
 */
export function estimatePrice(pricing: Pricing[], input: EstimateInput): Estimate | null {
  const entry = pricing.find((p) => p.serviceSlug === input.serviceSlug);
  if (!entry) return null;

  const option = entry.options.find((o) => o.type === input.type) ?? entry.options[0];
  const variant = entry.heightOptions[input.variantIndex ?? -1] ?? entry.heightOptions.find((h) => h.multiplier === 1) ?? entry.heightOptions[0];

  const quantity = Math.max(1, input.quantity);
  const unitPrice = option.from * variant.multiplier;
  const removal = input.removeOldFence && option.type === "installed" && option.unit === "lm" ? REMOVAL_PER_LM * quantity : 0;
  const total = unitPrice * quantity + removal;

  return {
    serviceSlug: entry.serviceSlug,
    type: option.type,
    unit: option.unit,
    quantity,
    variantLabel: variant.label,
    unitPrice,
    removal,
    total,
    low: total * 0.92,
    high: total * 1.12,
    yourShare: input.splitWithNeighbour ? total / 2 : null,
    gstIncluded: option.gstIncluded,
    includes: option.includes,
    excludes: option.excludes,
  };
}

export function fromPrice(pricing: Pricing[], serviceSlug: string, type: PricingOption["type"] = "installed") {
  const entry = pricing.find((p) => p.serviceSlug === serviceSlug);
  return entry?.options.find((o) => o.type === type) ?? entry?.options[0] ?? null;
}
