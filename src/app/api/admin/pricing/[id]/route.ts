import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const bodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  tagline: z.string().min(1).max(300),
  price: z.number().int().min(0),
  billingPeriod: z.string().min(1),
  classesPerWeek: z.number().int().min(1),
  classesPerMonth: z.number().int().min(1),
  minutesPerClass: z.number().int().min(1),
  altPricingNote: z.string().nullable().optional(),
  features: z.array(z.string().min(1)).optional(),
  highlighted: z.boolean().optional(),
  ctaLabel: z.string().min(1),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const plan = await prisma.pricingPlan.findUnique({ where: { id: Number(id) } });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ plan });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const existing = await prisma.pricingPlan.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  if (data.slug !== existing.slug) {
    const clash = await prisma.pricingPlan.findUnique({ where: { slug: data.slug } });
    if (clash) {
      return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    }
  }

  const plan = await prisma.pricingPlan.update({
    where: { id: existing.id },
    data: {
      name: data.name,
      slug: data.slug,
      tagline: data.tagline,
      price: data.price,
      billingPeriod: data.billingPeriod,
      classesPerWeek: data.classesPerWeek,
      classesPerMonth: data.classesPerMonth,
      minutesPerClass: data.minutesPerClass,
      altPricingNote: data.altPricingNote || null,
      features: data.features ?? [],
      highlighted: data.highlighted ?? false,
      ctaLabel: data.ctaLabel,
      published: data.published ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ plan });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  await prisma.pricingPlan.delete({ where: { id: Number(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
