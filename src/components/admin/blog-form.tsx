"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/rich-text-editor";
import ImageUploader from "@/components/image-uploader";

type BlogFormValues = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverImage: string | null;
  tags: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  status: "DRAFT" | "PUBLISHED";
};

export default function BlogForm({ initial }: { initial?: BlogFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>(
    initial ?? {
      title: "",
      slug: "",
      excerpt: "",
      contentHtml: "",
      coverImage: null,
      tags: null,
      seoTitle: null,
      seoDescription: null,
      ogImage: null,
      status: "DRAFT",
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(values.id ? `/api/admin/blogs/${values.id}` : "/api/admin/blogs", {
        method: values.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/admin/blogs");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <div>
        <label className="block text-sm text-muted mb-1.5">Title</label>
        <input
          required
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
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
          placeholder="my-post-title"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-mono outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Excerpt</label>
        <textarea
          required
          maxLength={500}
          rows={2}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <ImageUploader
        label="Cover image"
        category="blogs"
        value={values.coverImage}
        onChange={(v) => set("coverImage", v)}
      />

      <div>
        <label className="block text-sm text-muted mb-1.5">Content</label>
        <RichTextEditor value={values.contentHtml} onChange={(html) => set("contentHtml", html)} />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Tags (comma-separated)</label>
        <input
          value={values.tags ?? ""}
          onChange={(e) => set("tags", e.target.value || null)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <fieldset className="rounded-lg border border-border p-4 space-y-4">
        <legend className="px-1 text-sm text-muted">SEO</legend>
        <div>
          <label className="block text-sm text-muted mb-1.5">SEO title</label>
          <input
            value={values.seoTitle ?? ""}
            onChange={(e) => set("seoTitle", e.target.value || null)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">SEO description</label>
          <textarea
            maxLength={500}
            rows={2}
            value={values.seoDescription ?? ""}
            onChange={(e) => set("seoDescription", e.target.value || null)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <ImageUploader
          label="OG image (social share preview)"
          category="blogs"
          value={values.ogImage}
          onChange={(v) => set("ogImage", v)}
        />
      </fieldset>

      <div>
        <label className="block text-sm text-muted mb-1.5">Status</label>
        <select
          value={values.status}
          onChange={(e) => set("status", e.target.value as "DRAFT" | "PUBLISHED")}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
      >
        {saving ? "Saving…" : values.id ? "Save changes" : "Create post"}
      </button>
    </form>
  );
}
