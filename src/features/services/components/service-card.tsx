import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { SmartImage } from "@/components/ui/smart-image";
import type { PricingOption, Service } from "@/lib/schemas";
import { formatCurrency, unitLabel } from "@/lib/utils";

type Props = { service: Service; installed?: PricingOption | null; supply?: PricingOption | null; showPrices?: boolean };

export function ServiceCard({ service, installed, supply, showPrices = true }: Props) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <SmartImage image={service.image} className="aspect-[4/3] transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl bg-white/95 text-forest-700 shadow-soft">
          <Icon name={service.icon} className="size-5" />
        </span>
        <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/0 text-white opacity-0 transition-all group-hover:bg-ochre-500 group-hover:opacity-100">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold">{service.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[15px] leading-relaxed text-muted">{service.summary}</p>

        {showPrices && installed && (
          <div className="mt-5 flex items-end justify-between gap-3 border-t border-ink/8 pt-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Installed from</p>
              <p className="font-display text-2xl font-bold text-forest-800">
                {formatCurrency(installed.from)}
                <span className="text-sm font-medium text-muted">{unitLabel(installed.unit)}</span>
              </p>
            </div>
            {supply && (
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Supply only</p>
                <p className="text-sm font-semibold text-ink/80">
                  {formatCurrency(supply.from)}
                  {unitLabel(supply.unit)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
