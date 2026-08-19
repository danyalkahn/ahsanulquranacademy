"use client";

import { useState } from "react";

const fieldLabel = "font-mono text-[11px] tracking-[0.16em] text-muted-2 mb-2 block";
const fieldInput =
  "w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3.5 text-sm text-foreground outline-none focus:border-primary";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-primary">Message sent</p>
        <p className="mt-2 text-sm text-muted">
          Thanks for reaching out — we&apos;ll be in touch shortly.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm text-primary hover:underline">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={fieldLabel}>YOUR NAME</label>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>EMAIL</label>
          <input
            required
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={fieldInput}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={fieldLabel}>
            PHONE <span className="text-muted-2 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            type="tel"
            placeholder="+1 234 567 8900"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>SUBJECT</label>
          <input
            placeholder="What's this about?"
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            className={fieldInput}
          />
        </div>
      </div>

      <div>
        <label className={fieldLabel}>MESSAGE</label>
        <textarea
          required
          rows={5}
          placeholder="How can we help?"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${fieldInput} resize-y leading-relaxed`}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_8px_26px_rgba(20,52,92,0.35)] transition hover:bg-primary-light disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
