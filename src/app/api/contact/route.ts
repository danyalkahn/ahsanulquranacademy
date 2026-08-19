import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { contactNotificationEmail, contactAutoReplyEmail } from "@/lib/email-templates";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).nullable().optional(),
  subject: z.string().max(200).nullable().optional(),
  message: z.string().min(1).max(5000),
  // Honeypot: real users never fill this in; bots usually do.
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitKey = `contact:${ip}`;

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

  // Honeypot tripped — pretend success without doing anything.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      ip,
    },
  });

  // The submission is already saved at this point, so an email failure
  // (e.g. misconfigured SMTP) shouldn't make the visitor think their
  // message was lost — log it server-side and still report success.
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { subject, html, text } = contactNotificationEmail(data);
      await sendMail({ to: adminEmail, subject, html, text });
    }

    const autoReply = contactAutoReplyEmail(data.name);
    await sendMail({ to: data.email, subject: autoReply.subject, html: autoReply.html, text: autoReply.text });
  } catch (err) {
    console.error("Failed to send contact form email:", err);
  }

  return NextResponse.json({ ok: true });
}
