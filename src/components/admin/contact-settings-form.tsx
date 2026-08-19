"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

type SocialLink = { label: string; href: string };

type ContactSettingsValues = {
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: SocialLink[];
};

export default function ContactSettingsForm({ initial }: { initial: ContactSettingsValues }) {
  const [values, setValues] = useState<ContactSettingsValues>(initial);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ContactSettingsValues>(key: K, value: ContactSettingsValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function setLink(index: number, key: keyof SocialLink, value: string) {
    setValues((v) => {
      const socialLinks = [...v.socialLinks];
      socialLinks[index] = { ...socialLinks[index], [key]: value };
      return { ...v, socialLinks };
    });
  }

  function addLink() {
    setValues((v) => ({ ...v, socialLinks: [...v.socialLinks, { label: "", href: "" }] }));
  }

  function removeLink(index: number) {
    setValues((v) => ({ ...v, socialLinks: v.socialLinks.filter((_, i) => i !== index) }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const payload = {
        ...values,
        socialLinks: values.socialLinks.filter((s) => s.label.trim() && s.href.trim()),
      };
      const res = await fetch("/api/admin/contact-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Something went wrong" });
        return;
      }
      setMessage({ type: "ok", text: "Contact details updated." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-sm">
      <h2 className="text-lg font-semibold mb-1">Contact & social</h2>
      <p className="text-xs text-muted-2 mb-4">
        Shown in the site footer and on the Contact page. Leave blank to use the defaults (
        {siteConfig.contactEmail}).
      </p>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1.5">Contact email</label>
          <input
            type="email"
            value={values.contactEmail ?? ""}
            onChange={(e) => set("contactEmail", e.target.value || null)}
            placeholder={siteConfig.contactEmail}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Phone / WhatsApp</label>
          <input
            type="tel"
            value={values.contactPhone ?? ""}
            onChange={(e) => set("contactPhone", e.target.value || null)}
            placeholder={siteConfig.phones[0]}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <fieldset className="rounded-lg border border-border p-4 space-y-3">
          <legend className="px-1 text-sm text-muted">Social links</legend>
          {values.socialLinks.length === 0 && (
            <p className="text-xs text-muted-2">No custom links yet — defaults are shown on the site.</p>
          )}
          {values.socialLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={link.label}
                onChange={(e) => setLink(i, "label", e.target.value)}
                placeholder="Facebook"
                className="w-28 shrink-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={link.href}
                onChange={(e) => setLink(i, "href", e.target.value)}
                placeholder="https://facebook.com/..."
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-xs text-red-600 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addLink} className="text-sm text-primary hover:underline">
            + Add social link
          </button>
        </fieldset>

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
          {saving ? "Saving…" : "Save contact details"}
        </button>
      </form>
    </div>
  );
}
