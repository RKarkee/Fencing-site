import type { Metadata } from "next";
import type { Seo } from "@/lib/schemas";

export function buildMetadata(seo: Seo, path: string): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: path,
      type: "website",
      locale: "en_AU",
      ...(seo.image && { images: [{ url: seo.image }] }),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}
