import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const bodySchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  contentHtml: z.string().min(1),
  coverImage: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  ogImage: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  slug: z.string().min(1).optional(),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
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
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      contentHtml: DOMPurify.sanitize(data.contentHtml),
      coverImage: data.coverImage || null,
      tags: data.tags || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      ogImage: data.ogImage || null,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
