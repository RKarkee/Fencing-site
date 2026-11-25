"use client";

import { Check, Info, MessageCircle, Minus } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useChatWidget } from "@/features/chat/hooks/use-chat-widget";
import type { Pricing } from "@/lib/schemas";
import { cn, formatCurrency, unitLabel } from "@/lib/utils";
import { useFenceEstimate } from "../hooks/use-fence-estimate";

type ServiceOption = { slug: string; name: string; shortName: string; icon: string };
type Props = { services: ServiceOption[]; pricing: Pricing[]; initialService?: string };

const chip = (active: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
    active ? "border-forest-700 bg-forest-700 text-white" : "border-ink/12 bg-white text-ink/80 hover:border-ink/30",
  );

export function FenceCalculator({ services, pricing, initialService }: Props) {
  const startSlug = services.some((s) => s.slug === initialService) ? initialService! : services[0].slug;
  const { entry, unit, estimate, availableTypes, values, actions } = useFenceEstimate(pricing, startSlug);
  const { openChat } = useChatWidget();
  const service = services.find((s) => s.slug === values.serviceSlug)!;
  const isEach = unit === "each";

  const bookWithEstimate = () => {
    if (!estimate) return;
    openChat(
      `I'd like to book a free measure. My estimate: ${estimate.quantity}${isEach ? " x" : "m of"} ${service.name} (${estimate.variantLabel}, ${
        estimate.type === "installed" ? "installed" : "supply only"
      }) ≈ ${formatCurrency(estimate.low)}–${formatCurrency(estimate.high)}.`,
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8 rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-soft sm:p-9">
        {/* Step 1 */}
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wider text-muted">1 · Fence type</legend>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {services.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => actions.setServiceSlug(s.slug)}
                aria-pressed={s.slug === values.serviceSlug}
                className={cn(
                  "flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                  s.slug === values.serviceSlug
                    ? "border-forest-700 bg-sage-100 ring-2 ring-forest-700/20"
                    : "border-ink/10 hover:border-ink/25 hover:bg-sand-50",
                )}
              >
                <Icon name={s.icon} className="size-5 text-forest-700" />
                <span className="text-sm font-semibold leading-tight">{s.shortName}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Step 2 */}
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wider text-muted">2 · Style / height</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.heightOptions.map((h, i) => (
              <button key={h.label} type="button" onClick={() => actions.setVariantIndex(i)} className={chip(i === values.variantIndex)}>
                {h.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Step 3 */}
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wider text-muted">3 · {isEach ? "How many?" : "Length"}</legend>
          <div className="mt-4 flex items-center gap-5">
            <input
              type="range"
              min={isEach ? 1 : 5}
              max={isEach ? 6 : 150}
              step={1}
              value={values.quantity}
              onChange={(e) => actions.setQuantity(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer accent-forest-700"
              aria-label={isEach ? "Number of gates" : "Fence length in metres"}
            />
            <div className="flex items-center rounded-xl border border-ink/12 bg-sand-50 px-3">
              <input
                type="number"
                min={1}
                value={values.quantity}
                onChange={(e) => actions.setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 bg-transparent py-2.5 text-right font-display text-lg font-bold outline-none"
                aria-label="Quantity"
              />
              <span className="pl-1 text-sm font-medium text-muted">{isEach ? "gate(s)" : "m"}</span>
            </div>
          </div>
        </fieldset>

        {/* Step 4 */}
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wider text-muted">4 · Options</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {availableTypes.map((t) => (
              <button key={t} type="button" onClick={() => actions.setType(t)} className={chip(values.type === t)}>
                {t === "installed" ? "Supplied & installed" : "Supply only (DIY)"}
              </button>
            ))}
          </div>
          {!isEach && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Remove old fence"
                hint="+$15/lm, installed jobs"
                checked={values.removeOldFence}
                disabled={values.type !== "installed"}
                onChange={actions.setRemoveOldFence}
              />
              <Toggle label="Split with neighbour" hint="Shared dividing fence, 50/50" checked={values.splitWithNeighbour} onChange={actions.setSplitWithNeighbour} />
            </div>
          )}
        </fieldset>
      </div>

      {/* Result */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        {estimate && (
          <div className="pickets overflow-hidden rounded-[var(--radius-card)] bg-forest-900 text-white shadow-lift">
            <div className="p-7 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-sage-400">Estimated price · GST incl.</p>
              <p className="mt-3 font-display text-4xl font-extrabold sm:text-5xl" aria-live="polite">
                {formatCurrency(estimate.low)}
                <span className="text-white/40"> – </span>
                {formatCurrency(estimate.high)}
              </p>
              {estimate.yourShare && (
                <p className="mt-2 inline-flex rounded-full bg-ochre-500/20 px-3 py-1 text-sm font-semibold text-ochre-400">
                  ≈ {formatCurrency(estimate.yourShare)} your 50% share
                </p>
              )}

              <dl className="mt-7 space-y-2.5 border-t border-white/10 pt-5 text-sm">
                <Row label={`${service.name} · ${estimate.variantLabel}`} value={`${formatCurrency(estimate.unitPrice)}${unitLabel(estimate.unit)}`} />
                <Row label={isEach ? "Quantity" : "Length"} value={isEach ? `${estimate.quantity}` : `${estimate.quantity} m`} />
                {estimate.removal > 0 && <Row label="Old fence removal" value={formatCurrency(estimate.removal)} />}
                <Row label="Indicative total" value={formatCurrency(estimate.total)} strong />
              </dl>

              <ul className="mt-6 space-y-1.5 text-sm">
                {estimate.includes.map((i) => (
                  <li key={i} className="flex gap-2 text-white/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-sage-400" aria-hidden /> {i}
                  </li>
                ))}
                {estimate.excludes.map((e) => (
                  <li key={e} className="flex gap-2 text-white/50">
                    <Minus className="mt-0.5 size-4 shrink-0" aria-hidden /> {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-forest-950/60 p-6">
              <button type="button" onClick={bookWithEstimate} className={buttonClasses("primary", "lg", "w-full")}>
                <MessageCircle className="size-4" aria-hidden /> Book a free measure
              </button>
              <p className="mt-3 flex items-start gap-2 text-xs text-white/50">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Indicative only. Ground conditions, access and slope can change the final price — confirmed in your fixed written quote.
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4", strong && "border-t border-white/10 pt-2.5 font-semibold text-white")}>
      <dt className={strong ? "" : "text-white/60"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={cn("flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-ink/10 p-4", disabled && "cursor-not-allowed opacity-50")}>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted">{hint}</span>
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked && !disabled}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-ink/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-forest-700 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-ochre-500" />
    </label>
  );
}
