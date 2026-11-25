"use client";

import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { useChatWidget } from "@/features/chat/hooks/use-chat-widget";
import type { Cta } from "@/lib/schemas";
import { ButtonLink, buttonClasses, type ButtonSize, type ButtonVariant } from "./ui/button";

type Props = {
  cta: Cta;
  size?: ButtonSize;
  /** Override the JSON variant, e.g. on dark backgrounds */
  variant?: ButtonVariant;
  className?: string;
};

/** Renders a CTA from JSON: a link, a phone call, or "open the AI assistant with a prompt" */
export function CtaButton({ cta, size = "lg", variant, className }: Props) {
  const { openChat } = useChatWidget();
  const v = variant ?? cta.variant;

  if (cta.action === "open-chat") {
    return (
      <button type="button" onClick={() => openChat(cta.prompt)} className={buttonClasses(v, size, className)}>
        <MessageCircle className="size-4" aria-hidden />
        {cta.label}
      </button>
    );
  }

  if (cta.action === "call") {
    return (
      <a href={cta.href} className={buttonClasses(v, size, className)}>
        <Phone className="size-4" aria-hidden />
        {cta.label}
      </a>
    );
  }

  return (
    <ButtonLink href={cta.href ?? "/"} variant={v} size={size} className={className}>
      {cta.label}
      <ArrowRight className="size-4" aria-hidden />
    </ButtonLink>
  );
}
