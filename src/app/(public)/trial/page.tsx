"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { HeroBadge, HeroGlow } from "@/components/hero-background";

const fieldLabel = "font-mono text-[11px] tracking-[0.16em] text-muted-2 mb-2 block";
const fieldInput =
  "w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3.5 text-sm text-foreground outline-none focus:border-primary";

const plans = ["Foundation", "Steady", "Immersion", "Not sure yet"];

function TrialForm() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course") || "";
  const planParam = searchParams.get("plan") || "";
  const initialCourse = siteConfig.courseNav.find((c) => c.slug === courseSlug)?.label || "";
  const initialPlan = plans.find((p) => p.toLowerCase() === planParam.toLowerCase()) || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: initialCourse,
    preferredPlan: initialPlan,
    preferredTime: "",
    notes: "",
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
      const res = await fetch("/api/trial-request", {
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
      <div className="rounded-[26px] border border-black/10 bg-white p-6 sm:p-9 shadow-[0_24px_60px_rgba(15,110,79,0.08)] py-16 text-center">
        <p className="text-lg font-semibold text-primary">Trial request received</p>
        <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
          JazakAllah khair — one of our team members will contact you shortly to schedule your
          free trial class.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 rounded-[26px] border border-black/10 bg-white p-6 sm:p-9 shadow-[0_24px_60px_rgba(15,110,79,0.08)]"
    >
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
            PHONE / WHATSAPP <span className="text-muted-2 normal-case tracking-normal">(optional)</span>
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
          <label className={fieldLabel}>PREFERRED TIME</label>
          <input
            placeholder="e.g. Weekday evenings, EST"
            value={form.preferredTime}
            onChange={(e) => set("preferredTime", e.target.value)}
            className={fieldInput}
          />
        </div>
      </div>

      <div>
        <label className={fieldLabel}>COURSE</label>
        <select
          value={form.course}
          onChange={(e) => set("course", e.target.value)}
          className={fieldInput}
        >
          <option value="">Select a course</option>
          {siteConfig.courseNav.map((c) => (
            <option key={c.slug} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={fieldLabel}>PLAN YOU&apos;RE INTERESTED IN</label>
        <div className="flex flex-wrap gap-2">
          {plans.map((plan) => {
            const active = form.preferredPlan === plan;
            return (
              <button
                key={plan}
                type="button"
                onClick={() => set("preferredPlan", active ? "" : plan)}
                className={`rounded-full border px-4.5 py-2.5 text-[13px] transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-black/10 text-muted hover:border-black/25"
                }`}
              >
                {plan}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className={fieldLabel}>
          ANYTHING ELSE? <span className="text-muted-2 normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          rows={4}
          placeholder="Student's age, current level, goals — anything that helps us match the right teacher."
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className={`${fieldInput} resize-y leading-relaxed`}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_8px_26px_rgba(15,110,79,0.35)] transition hover:bg-primary-light disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Request my free trial →"}
      </button>
    </form>
  );
}

export default function TrialPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <HeroGlow />
      <div className="relative mx-auto max-w-2xl px-6 pt-20 pb-6 text-center">
        <HeroBadge label="FREE TRIAL CLASS" />
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Start your free
          <br />
          <span className="bg-gradient-to-r from-primary via-primary-lighter to-primary bg-clip-text text-transparent">
            trial class
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15.5px] text-muted leading-relaxed">
          Tell us a bit about the student — we&apos;ll match you with the right teacher and
          schedule your free trial.
        </p>
      </div>

      <div className="relative mx-auto max-w-xl px-6">
        <Suspense fallback={null}>
          <TrialForm />
        </Suspense>
      </div>
    </div>
  );
}
