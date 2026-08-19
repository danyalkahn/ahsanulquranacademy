import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { generateOtpCode, hashOtpCode } from "@/lib/otp";
import { sendMail } from "@/lib/mailer";
import { passwordResetEmail } from "@/lib/email-templates";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

const bodySchema = z.object({ email: z.string().email() });

const RESET_TTL_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { email } = parsed.data;
  const ip = getClientIp(request);
  const rateLimitKey = `forgot-password:${ip}`;

  const { allowed } = await checkRateLimit(rateLimitKey, {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }
  await recordAttempt(rateLimitKey);

  const adminUser = await prisma.adminUser.findUnique({ where: { email } });

  if (adminUser) {
    const code = generateOtpCode();
    const codeHash = await hashOtpCode(code);
    const token = crypto.randomUUID();

    await prisma.passwordResetCode.create({
      data: {
        token,
        adminUserId: adminUser.id,
        codeHash,
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });

    // Errors are swallowed here (just logged) rather than surfaced to the
    // client — this endpoint always returns the same generic response so
    // it can't be used to enumerate whether the account exists.
    try {
      const { subject, html, text } = passwordResetEmail(code);
      await sendMail({ to: adminUser.email, subject, html, text });
    } catch (err) {
      console.error("Failed to send password reset email:", err);
    }
  }

  // Same response whether or not the account exists, so this endpoint
  // can't be used to enumerate the admin's email.
  return NextResponse.json({
    ok: true,
    message: "If that email exists, a reset code has been sent.",
  });
}
