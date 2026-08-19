import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const bodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  tagline: z.string().min(1).max(300),
  price: z.number().int().min(0),
  billingPeriod: z.string().min(1).default("month"),
  classesPerWeek: z.number().int().min(1),
  classesPerMonth: z.number().int().min(1),
  minutesPerClass: z.number().int().min(1),
  altPricingNote: z.string().nullable().optional(),
  features: z.array(z.string().min(1)).optional(),
  highlighted: z.boolean().optional(),
  ctaLabel: z.string().min(1).default("Start Free Trial"),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const plans = await prisma.pricingPlan.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  const baseSlug = slugify(data.slug || data.name, { lower: true, strict: true });
  let slug = baseSlug;
  let n = 1;
  while (await prisma.pricingPlan.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const plan = await prisma.pricingPlan.create({
    data: {
      name: data.name,
      slug,
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

  return NextResponse.json({ plan }, { status: 201 });
}
