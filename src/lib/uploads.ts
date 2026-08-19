import { prisma } from "@/lib/db";

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export type UploadCategory = "blogs" | "courses" | "reviews" | "branding";

export const UPLOAD_CATEGORIES: UploadCategory[] = ["blogs", "courses", "reviews", "branding"];

// Stored as bytes in the database (not on disk) so uploads survive Hostinger
// deploys that wipe the filesystem outside of git.
export async function saveUploadedImage(file: File, category: UploadCategory): Promise<string> {
  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }
  if (file.size === 0) {
    throw new Error("Empty file");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File too large (max 5MB)");
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type (allowed: png, jpeg, webp)");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await prisma.mediaAsset.create({
    data: { category, mimeType: file.type, data: buffer },
  });

  return `/api/media/${asset.id}`;
}
