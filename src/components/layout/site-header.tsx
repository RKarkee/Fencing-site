"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useChatWidget } from "@/features/chat/hooks/use-chat-widget";
import type { Navigation, Office } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { buttonClasses } from "../ui/button";
import { Logo } from "./logo";

type Props = { navigation: Navigation; primaryOffice: Office };

export function SiteHeader({ navigation, primaryOffice }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { openChat } = useChatWidget();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-sand-50/85 backdrop-blur-xl">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navigation.main.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:bg-ink/5",
                    isActive(item.href) ? "text-forest-700" : "text-ink/80",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-[540px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-3xl border border-ink/5 bg-white p-3 shadow-lift">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="rounded-2xl p-3 transition-colors hover:bg-sand-100">
                        <span className="block text-sm font-semibold text-ink">{child.label}</span>
                        {child.description && <span className="mt-0.5 block text-xs text-muted">{child.description}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:bg-ink/5",
                  isActive(item.href) ? "text-forest-700" : "text-ink/80",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${primaryOffice.phoneE164}`} className="hidden items-center gap-2 px-3 text-sm font-semibold text-ink xl:flex">
            <Phone className="size-4 text-ochre-600" aria-hidden />
            {primaryOffice.phone}
          </a>
          <button
            type="button"
            onClick={() => openChat("I'd like to book a free measure and quote")}
            className={buttonClasses("primary", "md", "hidden sm:inline-flex")}
          >
            <MessageCircle className="size-4" aria-hidden />
            Free measure
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-ink/5 bg-sand-50 lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col gap-1 py-4">
            {navigation.main.map((item) => (
              <div key={item.href}>
                <Link href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 text-lg font-semibold">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mb-2 grid grid-cols-2 gap-1 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
