import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ChatWidget } from "@/features/chat/components/chat-widget";
import { content } from "@/lib/data";
import { JsonLd, localBusinessJsonLd } from "@/lib/seo/json-ld";
import { AppProviders } from "@/providers/app-providers";

export async function generateMetadata(): Promise<Metadata> {
  const site = await content.getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s` },
    description: site.description,
    applicationName: site.name,
  };
}

export const viewport: Viewport = {
  themeColor: "#163024",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, navigation, services] = await Promise.all([content.getSite(), content.getNavigation(), content.getServices()]);
  const primaryOffice = site.offices[0];

  return (
    <html lang="en-AU" className="h-full" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <JsonLd data={localBusinessJsonLd(site)} />
        <AppProviders>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
            Skip to content
          </a>
          <AnnouncementBar announcement={site.announcement} />
          <SiteHeader navigation={navigation} primaryOffice={primaryOffice} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter site={site} navigation={navigation} />
          <MobileActionBar phoneE164={primaryOffice.phoneE164} />
          <ChatWidget businessName={site.shortName} services={services.map((s) => ({ slug: s.slug, name: s.name }))} />
        </AppProviders>
      </body>
    </html>
  );
}
