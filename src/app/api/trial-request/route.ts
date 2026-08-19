import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { trialRequestNotificationEmail, trialRequestAutoReplyEmail } from "@/lib/email-templates";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).nullable().optional(),
  course: z.string().max(200).nullable().optional(),
  preferredPlan: z.string().max(100).nullable().optional(),
  preferredTime: z.string().max(200).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  // Honeypot: real users never fill this in; bots usually do.
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitKey = `trial-request:${ip}`;

  const { allowed } = await checkRateLimit(rateLimitKey, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  const data = parsed.data;

  await recordAttempt(rateLimitKey);

  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  await prisma.trialRequest.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      course: data.course || null,
      preferredPlan: data.preferredPlan || null,
      preferredTime: data.preferredTime || null,
      notes: data.notes || null,
      ip,
    },
  });

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { subject, html, text } = trialRequestNotificationEmail(data);
      await sendMail({ to: adminEmail, subject, html, text });
    }

    const autoReply = trialRequestAutoReplyEmail(data.name);
    await sendMail({ to: data.email, subject: autoReply.subject, html: autoReply.html, text: autoReply.text });
  } catch (err) {
    console.error("Failed to send trial request email:", err);
  }

  return NextResponse.json({ ok: true });
}
