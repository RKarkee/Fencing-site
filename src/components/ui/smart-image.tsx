"use client";

/* eslint-disable @next/next/no-img-element -- remote demo photos are served via redirect URLs that next/image can't optimise */
import { useState } from "react";
import { Fence } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/lib/schemas";

type Props = {
  image: ImageAsset;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Image with a branded fallback, so a missing or slow demo photo never looks broken.
 * When real photos live in /public or a CDN, swap the <img> for next/image here — one file.
 */
export function SmartImage({ image, className, priority }: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950", className)}>
      {/* Fallback / loading layer */}
      <div
        className={cn(
          "pickets absolute inset-0 flex items-center justify-center transition-opacity duration-500",
          status === "loaded" ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        <Fence className={cn("size-10 text-white/20", status === "loading" && "animate-pulse")} />
      </div>
      {status !== "error" && (
        <img
          src={image.src}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          ref={(el) => {
            // Image may finish before hydration attaches onLoad/onError
            if (el?.complete) setStatus(el.naturalWidth > 0 ? "loaded" : "error");
          }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
