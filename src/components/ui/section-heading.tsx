import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({ eyebrow, heading, subheading, align = "left", tone = "dark", className }: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]",
            tone === "dark" ? "text-ochre-600" : "text-ochre-400",
          )}
        >
          <span className="h-px w-6 bg-current" />
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-3xl font-bold leading-[1.1] sm:text-[2.6rem]", tone === "dark" ? "text-ink" : "text-white")}>
        {heading}
      </h2>
      {subheading && (
        <p className={cn("mt-4 text-lg leading-relaxed", tone === "dark" ? "text-muted" : "text-white/70")}>{subheading}</p>
      )}
    </div>
  );
}
