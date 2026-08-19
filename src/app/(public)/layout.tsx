import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteSettings } from "@/lib/site-settings";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime, and the
// logo/favicon can be changed live from the admin settings page.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { faviconUrl } = await getSiteSettings();
  return faviconUrl ? { icons: { icon: faviconUrl } } : {};
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, logoWidth, contactEmail, contactPhone, socialLinks } = await getSiteSettings();

  return (
    <>
      <SiteHeader logoUrl={logoUrl} logoWidth={logoWidth} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        logoUrl={logoUrl}
        logoWidth={logoWidth}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        socialLinks={socialLinks}
      />
    </>
  );
}
