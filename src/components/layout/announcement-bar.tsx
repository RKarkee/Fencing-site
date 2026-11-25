import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Site } from "@/lib/schemas";

export function AnnouncementBar({ announcement }: { announcement: Site["announcement"] }) {
  if (!announcement?.enabled) return null;
  const content = (
    <>
      <span className="size-1.5 animate-pulse rounded-full bg-ochre-400" aria-hidden />
      {announcement.text}
      {announcement.href && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />}
    </>
  );
  return (
    <div className="bg-forest-900 text-white">
      <div className="container-page flex h-9 items-center justify-center text-center text-[13px] font-medium">
        {announcement.href ? (
          <Link href={announcement.href} className="group flex items-center gap-2 hover:text-sage-200">
            {content}
          </Link>
        ) : (
          <p className="flex items-center gap-2">{content}</p>
        )}
      </div>
    </div>
  );
}
