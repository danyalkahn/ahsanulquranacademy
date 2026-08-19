import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, category: true },
  });

  return NextResponse.json({
    media: assets.map((a) => ({ path: `/api/media/${a.id}`, category: a.category })),
  });
}
