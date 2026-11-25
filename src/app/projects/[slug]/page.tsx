import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SmartImage } from "@/components/ui/smart-image";
import { content } from "@/lib/data";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";
import { CtaBannerSection } from "@/sections/cta-banner";

export async function generateStaticParams() {
  const projects = await content.getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await content.getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata(
    { title: `${project.title} · ${project.suburb} | Saltbush Fencing Co.`, description: project.summary, image: project.image.src },
    `/projects/${slug}`,
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, site, services] = await Promise.all([content.getProjectBySlug(slug), content.getSite(), content.getServices()]);
  if (!project) notFound();
  const service = services.find((s) => s.slug === project.serviceSlug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ];

  const facts = [
    { label: "Location", value: `${project.suburb} WA` },
    { label: "Fence type", value: service?.name ?? project.serviceSlug },
    { label: "Length", value: project.length },
    { label: "On site", value: project.duration },
    { label: "Completed", value: formatDate(`${project.completed}-01`, { month: "long", year: "numeric" }) },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, crumbs)} />
      <article className="container-page pb-20 pt-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">{project.title}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-relaxed text-muted">{project.summary}</p>
        <SmartImage image={project.image} priority className="mt-10 aspect-[16/8] rounded-[2rem] shadow-lift" />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_2fr]">
          <dl className="h-fit divide-y divide-ink/8 rounded-[var(--radius-card)] border border-ink/8 bg-white p-6 shadow-soft">
            {facts.map((f) => (
              <div key={f.label} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-muted">{f.label}</dt>
                <dd className="text-right font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="space-y-10 text-lg leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold">The challenge</h2>
              <p className="mt-3 text-ink/80">{project.challenge}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">What we did</h2>
              <p className="mt-3 text-ink/80">{project.outcome}</p>
            </div>
            {service && (
              <Link href={`/services/${service.slug}`} className="inline-block font-semibold text-forest-700 underline-offset-4 hover:underline">
                Learn more about {service.name.toLowerCase()} →
              </Link>
            )}
          </div>
        </div>
      </article>
      <CtaBannerSection
        section={{
          type: "cta-banner",
          heading: "Want a result like this?",
          subheading: "Book a free measure and we'll talk through options on site.",
          ctas: [{ label: "Book a free measure", action: "open-chat", prompt: "I'd like to book a free measure", variant: "primary" }],
        }}
      />
    </>
  );
}
