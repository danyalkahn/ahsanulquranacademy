import { NextResponse } from "next/server";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const bodySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  contentHtml: z.string().min(1),
  coverImage: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  ogImage: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const existing = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  if (data.slug !== existing.slug) {
    const clash = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (clash) {
      return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    }
  }

  const wasPublished = existing.status === "PUBLISHED";
  const nowPublished = data.status === "PUBLISHED";

  const post = await prisma.blogPost.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      contentHtml: DOMPurify.sanitize(data.contentHtml),
      coverImage: data.coverImage || null,
      tags: data.tags || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      ogImage: data.ogImage || null,
      status: data.status,
      publishedAt: !wasPublished && nowPublished ? new Date() : existing.publishedAt,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id: Number(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
