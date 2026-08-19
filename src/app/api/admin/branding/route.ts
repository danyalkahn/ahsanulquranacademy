import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const bodySchema = z.object({
  logoUrl: z.string().nullable().optional(),
  logoWidth: z.number().int().min(16).max(240).nullable().optional(),
  faviconUrl: z.string().nullable().optional(),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json({
    logoUrl: settings?.logoUrl ?? null,
    logoWidth: settings?.logoWidth ?? null,
    faviconUrl: settings?.faviconUrl ?? null,
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
    update: { logoUrl: data.logoUrl || null, logoWidth: data.logoWidth ?? null, faviconUrl: data.faviconUrl || null },
    create: {
      id: 1,
      logoUrl: data.logoUrl || null,
      logoWidth: data.logoWidth ?? null,
      faviconUrl: data.faviconUrl || null,
    },
  });

  return NextResponse.json({
    logoUrl: settings.logoUrl,
    logoWidth: settings.logoWidth,
    faviconUrl: settings.faviconUrl,
  });
}
