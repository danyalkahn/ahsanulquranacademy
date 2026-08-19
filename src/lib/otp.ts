import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateOtpCode(): string {
  // 6-digit numeric code, cryptographically random, zero-padded.
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

export async function hashOtpCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyOtpCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}
