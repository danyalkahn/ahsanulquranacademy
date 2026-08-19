import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import { saveUploadedImage, UPLOAD_CATEGORIES, type UploadCategory } from "@/lib/uploads";

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const category = formData?.get("category");

  if (
    !(file instanceof File) ||
    typeof category !== "string" ||
    !UPLOAD_CATEGORIES.includes(category as UploadCategory)
  ) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  try {
    const path = await saveUploadedImage(file, category as UploadCategory);
    return NextResponse.json({ path });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 400 });
  }
}
