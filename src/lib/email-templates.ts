function wrap(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#F6F1E4;padding:32px;color:#1C2B22">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid rgba(15,110,79,0.18);border-radius:12px;padding:32px">
      <div style="font:600 12px 'IBM Plex Mono',monospace;letter-spacing:.16em;color:#0F6E4F;margin-bottom:16px">AHSAN UL QURAN ACADEMY</div>
      <h1 style="font-size:20px;margin:0 0 16px;color:#14261C">${title}</h1>
      ${bodyHtml}
    </div>
  </body>
</html>`;
}

function codeBlock(code: string) {
  return `<div style="font:700 32px 'IBM Plex Mono',monospace;letter-spacing:.2em;color:#0F6E4F;background:rgba(15,110,79,0.08);border-radius:8px;padding:16px 20px;text-align:center;margin:20px 0">${code}</div>`;
}

export function loginOtpEmail(code: string) {
  return {
    subject: `Your admin sign-in code: ${code}`,
    text: `Your sign-in verification code is ${code}. It expires in 5 minutes. If you didn't try to sign in, you can ignore this email.`,
    html: wrap(
      "Sign-in verification code",
      `<p style="color:rgba(28,43,34,.75);line-height:1.6">Enter this code to finish signing in to the Ahsan Ul Quran Academy admin dashboard. It expires in 5 minutes.</p>${codeBlock(
        code
      )}<p style="color:rgba(28,43,34,.5);font-size:13px">If you didn't try to sign in, you can safely ignore this email.</p>`
    ),
  };
}

export function passwordResetEmail(code: string) {
  return {
    subject: `Your password reset code: ${code}`,
    text: `Your password reset code is ${code}. It expires in 15 minutes. If you didn't request this, you can ignore this email.`,
    html: wrap(
      "Password reset code",
      `<p style="color:rgba(28,43,34,.75);line-height:1.6">Use this code to reset your admin password. It expires in 15 minutes.</p>${codeBlock(
        code
      )}<p style="color:rgba(28,43,34,.5);font-size:13px">If you didn't request this, you can safely ignore this email.</p>`
    ),
  };
}

function rowsTable(rows: [string, string][]) {
  return `<table style="border-collapse:collapse;margin-bottom:16px">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:rgba(28,43,34,.5);font-size:13px">${label}</td><td style="padding:4px 0;color:#14261C;font-size:13px">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("")}</table>`;
}

export function contactNotificationEmail(submission: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}) {
  const rows: [string, string][] = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Phone", submission.phone || "—"],
    ["Subject", submission.subject || "—"],
  ];

  return {
    subject: `New contact form submission from ${submission.name}`,
    text: `New contact submission\n\nName: ${submission.name}\nEmail: ${submission.email}\nPhone: ${
      submission.phone || "—"
    }\nSubject: ${submission.subject || "—"}\n\n${submission.message}`,
    html: wrap(
      "New contact form submission",
      `${rowsTable(rows)}<p style="color:rgba(28,43,34,.75);line-height:1.6;white-space:pre-wrap">${escapeHtml(
        submission.message
      )}</p>`
    ),
  };
}

export function contactAutoReplyEmail(name: string) {
  return {
    subject: "We received your message — Ahsan Ul Quran Academy",
    text: `Assalamu Alaikum ${name},\n\nThanks for reaching out to Ahsan Ul Quran Academy. We've received your message and will get back to you shortly.\n\n— Ahsan Ul Quran Academy`,
    html: wrap(
      "Thanks for reaching out",
      `<p style="color:rgba(28,43,34,.75);line-height:1.6">Assalamu Alaikum ${escapeHtml(
        name
      )},</p><p style="color:rgba(28,43,34,.75);line-height:1.6">Thanks for reaching out to Ahsan Ul Quran Academy. We've received your message and will get back to you shortly, in sha Allah.</p>`
    ),
  };
}

export function trialRequestNotificationEmail(request: {
  name: string;
  email: string;
  phone?: string | null;
  course?: string | null;
  preferredPlan?: string | null;
  preferredTime?: string | null;
  notes?: string | null;
}) {
  const rows: [string, string][] = [
    ["Name", request.name],
    ["Email", request.email],
    ["Phone", request.phone || "—"],
    ["Course", request.course || "—"],
    ["Plan", request.preferredPlan || "—"],
    ["Preferred time", request.preferredTime || "—"],
  ];

  return {
    subject: `New free trial request from ${request.name}`,
    text: `New free trial request\n\nName: ${request.name}\nEmail: ${request.email}\nPhone: ${
      request.phone || "—"
    }\nCourse: ${request.course || "—"}\nPlan: ${request.preferredPlan || "—"}\nPreferred time: ${
      request.preferredTime || "—"
    }\n\n${request.notes || ""}`,
    html: wrap(
      "New free trial request",
      `${rowsTable(rows)}${
        request.notes
          ? `<p style="color:rgba(28,43,34,.75);line-height:1.6;white-space:pre-wrap">${escapeHtml(
              request.notes
            )}</p>`
          : ""
      }`
    ),
  };
}

export function trialRequestAutoReplyEmail(name: string) {
  return {
    subject: "Your free trial request — Ahsan Ul Quran Academy",
    text: `Assalamu Alaikum ${name},\n\nJazakAllah khair for requesting a free trial class with Ahsan Ul Quran Academy. One of our team members will contact you shortly to schedule your session.\n\n— Ahsan Ul Quran Academy`,
    html: wrap(
      "Your free trial request is in",
      `<p style="color:rgba(28,43,34,.75);line-height:1.6">Assalamu Alaikum ${escapeHtml(
        name
      )},</p><p style="color:rgba(28,43,34,.75);line-height:1.6">JazakAllah khair for requesting a free trial class with Ahsan Ul Quran Academy. One of our team members will contact you shortly to schedule your session, in sha Allah.</p>`
    ),
  };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
