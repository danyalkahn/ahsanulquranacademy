"use client";

import { useState } from "react";
import ImageUploader from "@/components/image-uploader";

type BrandingFormValues = {
  logoUrl: string | null;
  logoWidth: number | null;
  faviconUrl: string | null;
};

const DEFAULT_LOGO_WIDTH = 32;
const MIN_LOGO_WIDTH = 16;
const MAX_LOGO_WIDTH = 240;

export default function BrandingForm({ initial }: { initial: BrandingFormValues }) {
  const [values, setValues] = useState<BrandingFormValues>(initial);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof BrandingFormValues>(key: K, value: BrandingFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/branding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Something went wrong" });
        return;
      }
      setMessage({ type: "ok", text: "Branding updated." });
    } finally {
      setSaving(false);
    }
  }

  const logoWidth = values.logoWidth ?? DEFAULT_LOGO_WIDTH;

  return (
    <div className="max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Branding</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <ImageUploader
          label="Logo (defaults to the built-in logo if unset)"
          category="branding"
          value={values.logoUrl}
          onChange={(v) => set("logoUrl", v)}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm text-muted">Logo width</label>
            <span className="text-xs text-muted-2 font-mono">{logoWidth}px</span>
          </div>
          <input
            type="range"
            min={MIN_LOGO_WIDTH}
            max={MAX_LOGO_WIDTH}
            value={logoWidth}
            onChange={(e) => set("logoWidth", Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-3 flex h-20 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={values.logoUrl || "/brand/logo.svg"}
              alt="Logo preview"
              style={{ width: logoWidth, height: logoWidth }}
              className="object-contain"
            />
          </div>
        </div>

        <ImageUploader
          label="Favicon (defaults to the built-in favicon if unset)"
          category="branding"
          value={values.faviconUrl}
          onChange={(v) => set("faviconUrl", v)}
        />
        {message && (
          <p className={`text-sm ${message.type === "ok" ? "text-primary" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save branding"}
        </button>
      </form>
    </div>
  );
}
