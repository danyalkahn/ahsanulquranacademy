import { NextResponse } from "next/server";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const faqSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) });

const bodySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id: Number(id) } });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const existing = await prisma.course.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  if (data.slug !== existing.slug) {
    const clash = await prisma.course.findUnique({ where: { slug: data.slug } });
    if (clash) {
      return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    }
  }

  const course = await prisma.course.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      slug: data.slug,
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

  return NextResponse.json({ course });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  await prisma.course.delete({ where: { id: Number(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
