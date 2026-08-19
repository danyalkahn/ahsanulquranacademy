"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeToken = searchParams.get("challenge") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeToken, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="label text-xs text-primary mb-3">AHSAN UL QURAN ACADEMY ADMIN</div>
      <h1 className="text-2xl font-bold mb-2">Enter your code</h1>
      <p className="text-sm text-muted mb-8">
        We emailed a 6-digit verification code — it expires in 5 minutes.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1.5" htmlFor="code">
            Verification code
          </label>
          <input
            id="code"
            required
            maxLength={6}
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-center text-lg font-mono tracking-[0.3em] outline-none focus:border-primary"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || code.length !== 6 || !challengeToken}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify & sign in"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <Suspense fallback={null}>
        <VerifyForm />
      </Suspense>
    </main>
  );
}
