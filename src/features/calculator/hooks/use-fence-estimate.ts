"use client";

import { useMemo, useState } from "react";
import { estimatePrice } from "@/lib/pricing/estimate";
import type { Pricing, PricingOption } from "@/lib/schemas";

/** All calculator state + derived estimate in one hook (no effects — everything is derived) */
export function useFenceEstimate(pricing: Pricing[], initialService: string) {
  const [serviceSlug, setServiceSlugState] = useState(initialService);
  const [type, setType] = useState<PricingOption["type"]>("installed");
  const [quantity, setQuantity] = useState(30);
  const [variantIndex, setVariantIndex] = useState<number | null>(null);
  const [removeOldFence, setRemoveOldFence] = useState(false);
  const [splitWithNeighbour, setSplitWithNeighbour] = useState(false);

  const entry = pricing.find((p) => p.serviceSlug === serviceSlug) ?? pricing[0];
  const availableTypes = entry.options.map((o) => o.type);
  const effectiveType = availableTypes.includes(type) ? type : availableTypes[0];
  const unit = entry.options.find((o) => o.type === effectiveType)?.unit ?? "lm";
  const defaultVariant = Math.max(0, entry.heightOptions.findIndex((h) => h.multiplier === 1));
  const effectiveVariant = variantIndex ?? defaultVariant;

  const estimate = useMemo(
    () =>
      estimatePrice(pricing, {
        serviceSlug: entry.serviceSlug,
        type: effectiveType,
        quantity,
        variantIndex: effectiveVariant,
        removeOldFence,
        splitWithNeighbour,
      }),
    [pricing, entry.serviceSlug, effectiveType, quantity, effectiveVariant, removeOldFence, splitWithNeighbour],
  );

  /** Changing fence type resets options that don't apply to the new type */
  const setServiceSlug = (slug: string) => {
    setServiceSlugState(slug);
    setVariantIndex(null);
    const next = pricing.find((p) => p.serviceSlug === slug);
    if (next?.options[0]?.unit === "each") setQuantity(1);
    else if (unit === "each") setQuantity(30);
  };

  return {
    entry,
    unit,
    estimate,
    availableTypes,
    values: { serviceSlug: entry.serviceSlug, type: effectiveType, quantity, variantIndex: effectiveVariant, removeOldFence, splitWithNeighbour },
    actions: { setServiceSlug, setType, setQuantity, setVariantIndex, setRemoveOldFence, setSplitWithNeighbour },
  };
}
