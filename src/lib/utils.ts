import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
export const formatCurrency = (value: number) => aud.format(Math.round(value));

export const formatDate = (iso: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  new Intl.DateTimeFormat("en-AU", options).format(new Date(iso));

export const unitLabel = (unit: "lm" | "each" | "m2") => ({ lm: "/lm", each: " each", m2: "/m²" })[unit];
