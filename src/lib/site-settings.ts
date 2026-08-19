import { prisma } from "@/lib/db";

export type SocialLink = { label: string; href: string };

// Falls back to the built-in logo/favicon/contact info on any error — e.g.
// the database isn't reachable during `next build` on Hostinger, only at
// runtime, and branding should never be able to break the whole site from
// rendering. `contactEmail`/`contactPhone`/`socialLinks` are null when unset
// so callers can fall back to the hardcoded defaults in site-config.ts.
export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return {
      logoUrl: settings?.logoUrl ?? null,
      logoWidth: settings?.logoWidth ?? null,
      faviconUrl: settings?.faviconUrl ?? null,
      contactEmail: settings?.contactEmail ?? null,
      contactPhone: settings?.contactPhone ?? null,
      socialLinks: (Array.isArray(settings?.socialLinks) ? settings.socialLinks : null) as SocialLink[] | null,
    };
  } catch {
    return {
      logoUrl: null,
      logoWidth: null,
      faviconUrl: null,
      contactEmail: null,
      contactPhone: null,
      socialLinks: null,
    };
  }
}
