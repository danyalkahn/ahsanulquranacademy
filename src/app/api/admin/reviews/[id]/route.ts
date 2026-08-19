import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

const bodySchema = z.object({
  clientName: z.string().min(1),
  company: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  quote: z.string().min(1),
  avatar: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ review });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const existing = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  const review = await prisma.review.update({
    where: { id: existing.id },
    data: {
      clientName: data.clientName,
      company: data.company || null,
      role: data.role || null,
      quote: data.quote,
      avatar: data.avatar || null,
      rating: data.rating ?? null,
      published: data.published ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ review });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  await prisma.review.delete({ where: { id: Number(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
