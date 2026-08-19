"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Something went wrong" });
        return;
      }
      setMessage({ type: "ok", text: "Password updated." });
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Change password</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Current password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">New password</label>
          <input
            type="password"
            required
            minLength={10}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        {message && (
          <p className={`text-sm ${message.type === "ok" ? "text-primary" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
