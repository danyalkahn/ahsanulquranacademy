import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

const hasSmtpConfig = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 465),
      secure: Number(SMTP_PORT ?? 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!transporter) {
    // Dev fallback: no SMTP configured, log instead of sending so flows
    // (OTP, password reset, contact/trial notifications) remain testable
    // locally.
    console.log(
      `\n[mailer] SMTP not configured — would send email:\nTo: ${options.to}\nSubject: ${options.subject}\n${options.text}\n`
    );
    return;
  }

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
