import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import type { Project } from "@/lib/schemas";

export function ProjectCard({ project, serviceName }: { project: Project; serviceName?: string }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-[var(--radius-card)]">
        <SmartImage image={project.image} className="aspect-[4/3] transition-transform duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" aria-hidden />
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 text-xs font-semibold text-white">
          {serviceName && <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">{serviceName}</span>}
          <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">{project.length}</span>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-muted">
        <MapPin className="size-3.5 text-ochre-600" aria-hidden />
        {project.suburb}
      </p>
      <h3 className="mt-1 text-xl font-bold leading-snug transition-colors group-hover:text-forest-700">{project.title}</h3>
      <p className="mt-2 line-clamp-2 text-[15px] text-muted">{project.summary}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-forest-700">
        Read the case study <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
