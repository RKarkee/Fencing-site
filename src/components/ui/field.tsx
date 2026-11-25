import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "w-full rounded-xl border border-ink/12 bg-white px-3.5 py-2.5 text-[15px] outline-none transition placeholder:text-ink/35 focus:border-forest-600 focus:ring-4 focus:ring-forest-600/10 aria-invalid:border-red-500";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
