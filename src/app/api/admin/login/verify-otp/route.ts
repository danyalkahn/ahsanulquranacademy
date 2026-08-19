import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyOtpCode } from "@/lib/otp";
import { getAdminSession } from "@/lib/session";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

const bodySchema = z.object({
  challengeToken: z.string().min(1),
  code: z.string().length(6),
});

const MAX_OTP_ATTEMPTS = 5;

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { challengeToken, code } = parsed.data;
  const ip = getClientIp(request);
  const rateLimitKey = `otp:${ip}`;

  const { allowed } = await checkRateLimit(rateLimitKey, {
    maxAttempts: MAX_OTP_ATTEMPTS,
    windowMs: 15 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const challenge = await prisma.loginChallenge.findUnique({
    where: { token: challengeToken },
    include: { adminUser: true },
  });

  const invalidResponse = () => {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  };

  if (!challenge || challenge.consumedAt || challenge.expiresAt < new Date()) {
    await recordAttempt(rateLimitKey);
    return invalidResponse();
  }

  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    return invalidResponse();
  }

  const ok = await verifyOtpCode(code, challenge.otpHash);
  if (!ok) {
    await prisma.loginChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    await recordAttempt(rateLimitKey);
    return invalidResponse();
  }

  await prisma.loginChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  const session = await getAdminSession();
  session.adminUserId = challenge.adminUser.id;
  session.email = challenge.adminUser.email;
  await session.save();

  return NextResponse.json({ ok: true });
}
