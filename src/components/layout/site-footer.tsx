import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Navigation, Site } from "@/lib/schemas";
import { cacheLife } from "next/cache";
import { Logo } from "./logo";

/** Cached so the static shell can include it; refreshes daily */
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ site, navigation }: { site: Site; navigation: Navigation }) {
  const year = await currentYear();
  return (
    <footer className="pickets bg-forest-950 pb-28 text-white/70 lg:pb-0">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-5 leading-relaxed">{site.description}</p>
          <div className="mt-6 flex gap-2">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {navigation.footer.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-6 border-t border-white/10 py-10 md:grid-cols-2">
        {site.offices.map((office) => (
          <div key={office.id} className="flex flex-col gap-2 text-sm">
            <p className="font-display text-base font-semibold text-white">{office.name}</p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ochre-400" aria-hidden />
              {office.street}, {office.suburb} {office.state} {office.postcode}
              {office.note && <span className="text-white/50"> · {office.note}</span>}
            </p>
            <a href={`tel:${office.phoneE164}`} className="flex items-center gap-2 hover:text-white">
              <Phone className="size-4 text-ochre-400" aria-hidden /> {office.phone}
            </a>
            <p className="text-white/50">{office.hours.map((h) => `${h.label} ${h.value}`).join(" · ")}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName} · ABN {site.abn} · {site.licence}
          </p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-white">
              <Mail className="size-3.5" aria-hidden /> {site.email}
            </a>
            {navigation.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
