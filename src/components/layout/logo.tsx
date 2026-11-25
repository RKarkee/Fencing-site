import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#1f3d2b" />
      <path d="M11 30V15l3-3 3 3v15z" fill="#e8efe6" />
      <path d="M18.5 30V11l3-3 3 3v19z" fill="#d4842a" />
      <path d="M26 30V15l3-3 3 3v15z" fill="#e8efe6" />
      <rect x="9" y="19" width="25" height="2.4" rx="1" fill="#1f3d2b" opacity=".55" />
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="Saltbush Fencing Co. — home">
      <LogoMark className="size-9 transition-transform duration-300 group-hover:-rotate-3" />
      <span className="leading-none">
        <span className={cn("block font-display text-[1.15rem] font-bold tracking-tight", tone === "dark" ? "text-ink" : "text-white")}>
          Saltbush
        </span>
        <span className={cn("block text-[0.62rem] font-semibold uppercase tracking-[0.22em]", tone === "dark" ? "text-muted" : "text-white/60")}>
          Fencing Co.
        </span>
      </span>
    </Link>
  );
}
