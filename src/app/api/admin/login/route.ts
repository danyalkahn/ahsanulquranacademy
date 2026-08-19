import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { generateOtpCode, hashOtpCode } from "@/lib/otp";
import { sendMail } from "@/lib/mailer";
import { loginOtpEmail } from "@/lib/email-templates";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const ip = getClientIp(request);
  const rateLimitKey = `login:${ip}:${email.toLowerCase()}`;

  const { allowed } = await checkRateLimit(rateLimitKey, {
    maxAttempts: MAX_ATTEMPTS,
    windowMs: WINDOW_MS,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const genericError = () =>
    NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const adminUser = await prisma.adminUser.findUnique({ where: { email } });
  if (!adminUser) {
    await recordAttempt(rateLimitKey);
    return genericError();
  }

  const passwordOk = await bcrypt.compare(password, adminUser.passwordHash);
  if (!passwordOk) {
    await recordAttempt(rateLimitKey);
    return genericError();
  }

  const code = generateOtpCode();
  const otpHash = await hashOtpCode(code);
  const token = crypto.randomUUID();

  await prisma.loginChallenge.create({
    data: {
      token,
      adminUserId: adminUser.id,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  try {
    const { subject, html, text } = loginOtpEmail(code);
    await sendMail({ to: adminUser.email, subject, html, text });
  } catch (err) {
    console.error("Failed to send login OTP email:", err);
    return NextResponse.json(
      { error: "Couldn't send the verification code — check the SMTP configuration." },
      { status: 502 }
    );
  }

  return NextResponse.json({ challengeToken: token });
}
