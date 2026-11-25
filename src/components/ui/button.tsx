import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "outline-light";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ochre-500 text-white shadow-[0_8px_20px_-8px_rgb(212_132_42/0.7)] hover:bg-ochre-600",
  secondary: "bg-forest-800 text-white hover:bg-forest-700",
  ghost: "border border-ink/15 bg-white/60 text-ink hover:border-ink/30 hover:bg-white",
  light: "bg-white text-forest-900 hover:bg-sand-100",
  "outline-light": "border border-white/30 text-white hover:border-white/60 hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };

export function Button({ variant, size, className, ...props }: Common & ComponentProps<"button">) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, href, ...props }: Common & ComponentProps<typeof Link>) {
  return <Link href={href} className={buttonClasses(variant, size, className)} {...props} />;
}
