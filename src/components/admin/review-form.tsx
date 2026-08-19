"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/image-uploader";

type ReviewFormValues = {
  id?: number;
  clientName: string;
  company: string | null;
  role: string | null;
  quote: string;
  avatar: string | null;
  rating: number | null;
  published: boolean;
  sortOrder: number;
};

export default function ReviewForm({ initial }: { initial?: ReviewFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ReviewFormValues>(
    initial ?? {
      clientName: "",
      company: null,
      role: null,
      quote: "",
      avatar: null,
      rating: 5,
      published: true,
      sortOrder: 0,
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ReviewFormValues>(key: K, value: ReviewFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(values.id ? `/api/admin/reviews/${values.id}` : "/api/admin/reviews", {
        method: values.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/admin/reviews");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm text-muted mb-1.5">Client name</label>
        <input
          required
          value={values.clientName}
          onChange={(e) => set("clientName", e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Role</label>
          <input
            value={values.role ?? ""}
            onChange={(e) => set("role", e.target.value || null)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Company</label>
          <input
            value={values.company ?? ""}
            onChange={(e) => set("company", e.target.value || null)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Quote</label>
        <textarea
          required
          rows={3}
          value={values.quote}
          onChange={(e) => set("quote", e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <ImageUploader
        label="Avatar"
        category="reviews"
        value={values.avatar}
        onChange={(v) => set("avatar", v)}
      />

      <div className="flex items-center gap-6">
        <label className="text-sm text-muted">
          Rating
          <select
            value={values.rating ?? ""}
            onChange={(e) => set("rating", e.target.value ? Number(e.target.value) : null)}
            className="ml-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-primary"
          >
            <option value="">None</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          Sort order
          <input
            type="number"
            value={values.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
      >
        {saving ? "Saving…" : values.id ? "Save changes" : "Create review"}
      </button>
    </form>
  );
}
