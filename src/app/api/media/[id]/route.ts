import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return new NextResponse(null, { status: 404 });

  return new NextResponse(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
