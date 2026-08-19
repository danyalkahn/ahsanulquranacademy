import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const bodySchema = z.object({
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  socialLinks: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })).optional(),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json({
    contactEmail: settings?.contactEmail ?? null,
    contactPhone: settings?.contactPhone ?? null,
    socialLinks: Array.isArray(settings?.socialLinks) ? settings.socialLinks : [],
  });
}

export async function PATCH(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      socialLinks: data.socialLinks ?? [],
    },
    create: {
      id: 1,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      socialLinks: data.socialLinks ?? [],
    },
  });

  return NextResponse.json({
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    socialLinks: settings.socialLinks,
  });
}
