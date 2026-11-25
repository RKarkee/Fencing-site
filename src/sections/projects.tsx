import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/features/projects/components/project-card";
import { content } from "@/lib/data";
import type { SectionOf } from "@/lib/schemas";

export async function ProjectsSection({ section }: { section: SectionOf<"projects"> }) {
  const [projects, services] = await Promise.all([content.getProjects(), content.getServices()]);
  const list = projects.slice(0, section.limit);
  const nameFor = (slug: string) => services.find((s) => s.slug === slug)?.shortName;
  const showAllLink = projects.length > list.length;

  return (
    <section className="container-page section-y">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading} />
        {showAllLink && (
          <ButtonLink href="/projects" variant="ghost">
            All projects <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        )}
      </div>
      <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {list.map((project) => (
          <ProjectCard key={project.slug} project={project} serviceName={nameFor(project.serviceSlug)} />
        ))}
      </div>
    </section>
  );
}
