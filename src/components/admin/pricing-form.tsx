"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PricingFormValues = {
  id?: number;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  billingPeriod: string;
  classesPerWeek: number;
  classesPerMonth: number;
  minutesPerClass: number;
  altPricingNote: string | null;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
  published: boolean;
  sortOrder: number;
};

export default function PricingForm({ initial }: { initial?: PricingFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<PricingFormValues>(
    initial ?? {
      slug: "",
      name: "",
      tagline: "",
      price: 0,
      billingPeriod: "month",
      classesPerWeek: 2,
      classesPerMonth: 8,
      minutesPerClass: 30,
      altPricingNote: null,
      features: [],
      highlighted: false,
      ctaLabel: "Start Free Trial",
      published: true,
      sortOrder: 0,
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof PricingFormValues>(key: K, value: PricingFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function setFeature(index: number, value: string) {
    setValues((v) => {
      const features = [...v.features];
      features[index] = value;
      return { ...v, features };
    });
  }

  function addFeature() {
    setValues((v) => ({ ...v, features: [...v.features, ""] }));
  }

  function removeFeature(index: number) {
    setValues((v) => ({ ...v, features: v.features.filter((_, i) => i !== index) }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { ...values, features: values.features.filter((f) => f.trim()) };
      const res = await fetch(values.id ? `/api/admin/pricing/${values.id}` : "/api/admin/pricing", {
        method: values.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/admin/pricing");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Plan name</label>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">
            Slug {!values.id && <span className="text-muted-2">(leave blank to auto-generate)</span>}
          </label>
          <input
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            required={Boolean(values.id)}
            placeholder="foundation"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-mono outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Tagline</label>
        <input
          required
          maxLength={300}
          value={values.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          placeholder="For complete beginners taking their first step"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Price ($/mo)</label>
          <input
            type="number"
            required
            min={0}
            value={values.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Classes/week</label>
          <input
            type="number"
            required
            min={1}
            value={values.classesPerWeek}
            onChange={(e) => set("classesPerWeek", Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Classes/month</label>
          <input
            type="number"
            required
            min={1}
            value={values.classesPerMonth}
            onChange={(e) => set("classesPerMonth", Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Min/class</label>
          <input
            type="number"
            required
            min={1}
            value={values.minutesPerClass}
            onChange={(e) => set("minutesPerClass", Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">
          Alt pricing note <span className="text-muted-2">(optional)</span>
        </label>
        <input
          value={values.altPricingNote ?? ""}
          onChange={(e) => set("altPricingNote", e.target.value || null)}
          placeholder="Prefer 60-minute classes? $72/month"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <fieldset className="rounded-lg border border-border p-4 space-y-3">
        <legend className="px-1 text-sm text-muted">Features</legend>
        {values.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={feature}
              onChange={(e) => setFeature(i, e.target.value)}
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => removeFeature(i)}
              className="text-xs text-red-600 hover:text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addFeature} className="text-sm text-primary hover:underline">
          + Add feature
        </button>
      </fieldset>

      <div>
        <label className="block text-sm text-muted mb-1.5">CTA button label</label>
        <input
          value={values.ctaLabel}
          onChange={(e) => set("ctaLabel", e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={values.highlighted}
            onChange={(e) => set("highlighted", e.target.checked)}
          />
          Most Popular badge
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
        {saving ? "Saving…" : values.id ? "Save changes" : "Create plan"}
      </button>
    </form>
  );
}
