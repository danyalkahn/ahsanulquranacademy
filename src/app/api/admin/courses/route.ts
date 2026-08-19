import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const faqSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) });

const bodySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  shortDescription: z.string().min(1).max(500),
  contentHtml: z.string().min(1),
  heroImage: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  faqs: z.array(faqSchema).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  ogImage: z.string().nullable().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const courses = await prisma.course.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  const baseSlug = slugify(data.slug || data.title, { lower: true, strict: true });
  let slug = baseSlug;
  let n = 1;
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const course = await prisma.course.create({
    data: {
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      contentHtml: DOMPurify.sanitize(data.contentHtml),
      heroImage: data.heroImage || null,
      icon: data.icon || null,
      faqs: data.faqs ?? [],
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      ogImage: data.ogImage || null,
      published: data.published ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ course }, { status: 201 });
}
