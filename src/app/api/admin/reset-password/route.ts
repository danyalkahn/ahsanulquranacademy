import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { verifyOtpCode } from "@/lib/otp";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

const bodySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(10),
});

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request — password must be at least 10 characters" },
      { status: 400 }
    );
  }
  const { email, code, newPassword } = parsed.data;
  const ip = getClientIp(request);
  const rateLimitKey = `reset-password:${ip}`;

  const { allowed } = await checkRateLimit(rateLimitKey, {
    maxAttempts: MAX_ATTEMPTS,
    windowMs: 15 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const invalidResponse = () =>
    NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

  const adminUser = await prisma.adminUser.findUnique({ where: { email } });
  if (!adminUser) {
    await recordAttempt(rateLimitKey);
    return invalidResponse();
  }

  const candidate = await prisma.passwordResetCode.findFirst({
    where: {
      adminUserId: adminUser.id,
      consumedAt: null,
      expiresAt: { gt: new Date() },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!candidate) {
    await recordAttempt(rateLimitKey);
    return invalidResponse();
  }

  const ok = await verifyOtpCode(code, candidate.codeHash);
  if (!ok) {
    await prisma.passwordResetCode.update({
      where: { id: candidate.id },
      data: { attempts: { increment: 1 } },
    });
    await recordAttempt(rateLimitKey);
    return invalidResponse();
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.adminUser.update({ where: { id: adminUser.id }, data: { passwordHash } }),
    prisma.passwordResetCode.update({
      where: { id: candidate.id },
      data: { consumedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
