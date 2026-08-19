import { prisma } from "@/lib/db";

// Falls back to the built-in logo/favicon on any error — e.g. the database
// isn't reachable during `next build` on Hostinger, only at runtime, and
// branding should never be able to break the whole site from rendering.
export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return {
      logoUrl: settings?.logoUrl ?? null,
      logoWidth: settings?.logoWidth ?? null,
      faviconUrl: settings?.faviconUrl ?? null,
    };
  } catch {
    return { logoUrl: null, logoWidth: null, faviconUrl: null };
  }
}
