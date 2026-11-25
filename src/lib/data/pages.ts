import "server-only";
import { notFound } from "next/navigation";
import { content } from "./index";

/** Load a JSON page or 404 */
export async function getPageOrNotFound(slug: string) {
  const page = await content.getPage(slug);
  if (!page) notFound();
  return page;
}
