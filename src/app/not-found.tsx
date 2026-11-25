import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-sage-200">404</p>
      <h1 className="mt-4 text-4xl font-bold">This page has jumped the fence</h1>
      <p className="mt-3 max-w-md text-lg text-muted">The page you&apos;re after doesn&apos;t exist or has moved.</p>
      <ButtonLink href="/" size="lg" className="mt-8">
        Back to home <ArrowRight className="size-4" aria-hidden />
      </ButtonLink>
    </section>
  );
}
