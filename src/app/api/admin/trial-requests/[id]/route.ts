import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const trialRequest = await prisma.trialRequest.update({
    where: { id: Number(id) },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ trialRequest });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  await prisma.trialRequest.delete({ where: { id: Number(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
