"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="label text-xs text-primary mb-3">AHSAN UL QURAN ACADEMY ADMIN</div>
        <h1 className="text-2xl font-bold mb-2">Reset password</h1>
        <p className="text-sm text-muted mb-8">
          Enter your admin email and we&apos;ll send you a reset code.
        </p>

        {sent ? (
          <div>
            <p className="text-sm text-primary">
              If that email exists, a reset code has been sent. Check your inbox.
            </p>
            <Link href="/admin/reset-password" className="mt-6 inline-block text-sm text-primary hover:underline">
              I have a code →
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset code"}
            </button>
          </form>
        )}

        <Link href="/admin/login" className="mt-6 inline-block text-sm text-muted hover:text-primary">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
