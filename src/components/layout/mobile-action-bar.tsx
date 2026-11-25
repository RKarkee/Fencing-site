"use client";

import Link from "next/link";
import { Calculator, MessageCircle, Phone } from "lucide-react";
import { useChatWidget } from "@/features/chat/hooks/use-chat-widget";

/** Sticky Call / Chat / Price bar — most fencing leads come from phones */
export function MobileActionBar({ phoneE164 }: { phoneE164: string }) {
  const { openChat, isOpen } = useChatWidget();
  if (isOpen) return null;

  const item = "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold";
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-2xl border border-ink/10 bg-white/95 shadow-lift backdrop-blur lg:hidden">
      <a href={`tel:${phoneE164}`} className={item}>
        <Phone className="size-5 text-forest-700" aria-hidden />
        Call
      </a>
      <button type="button" onClick={() => openChat()} className={`${item} bg-ochre-500 text-white`}>
        <MessageCircle className="size-5" aria-hidden />
        Chat & book
      </button>
      <Link href="/calculator" className={item}>
        <Calculator className="size-5 text-forest-700" aria-hidden />
        Price it
      </Link>
    </div>
  );
}
