"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/rich-text-editor";
import ImageUploader from "@/components/image-uploader";

type Faq = { question: string; answer: string };

type CourseFormValues = {
  id?: number;
  title: string;
  slug: string;
  shortDescription: string;
  contentHtml: string;
  heroImage: string | null;
  icon: string | null;
  faqs: Faq[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  published: boolean;
  sortOrder: number;
};

export default function CourseForm({ initial }: { initial?: CourseFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<CourseFormValues>(
    initial ?? {
      title: "",
      slug: "",
      shortDescription: "",
      contentHtml: "",
      heroImage: null,
      icon: null,
      faqs: [],
      seoTitle: null,
      seoDescription: null,
      ogImage: null,
      published: true,
      sortOrder: 0,
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function setFaq(index: number, key: keyof Faq, value: string) {
    setValues((v) => {
      const faqs = [...v.faqs];
      faqs[index] = { ...faqs[index], [key]: value };
      return { ...v, faqs };
    });
  }

  function addFaq() {
    setValues((v) => ({ ...v, faqs: [...v.faqs, { question: "", answer: "" }] }));
  }

  function removeFaq(index: number) {
    setValues((v) => ({ ...v, faqs: v.faqs.filter((_, i) => i !== index) }));
  }

  function moveFaq(index: number, direction: -1 | 1) {
    setValues((v) => {
      const faqs = [...v.faqs];
      const target = index + direction;
      if (target < 0 || target >= faqs.length) return v;
      [faqs[index], faqs[target]] = [faqs[target], faqs[index]];
      return { ...v, faqs };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...values,
        faqs: values.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      };
      const res = await fetch(values.id ? `/api/admin/courses/${values.id}` : "/api/admin/courses", {
        method: values.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/admin/courses");
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
          placeholder="online-quran-classes-for-kids"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-mono outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Short description (used on course cards)</label>
        <textarea
          required
          maxLength={500}
          rows={2}
          value={values.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImageUploader
          label="Hero image"
          category="courses"
          value={values.heroImage}
          onChange={(v) => set("heroImage", v)}
        />
        <div>
          <label className="block text-sm text-muted mb-1.5">Icon (emoji, shown if no hero image)</label>
          <input
            value={values.icon ?? ""}
            onChange={(e) => set("icon", e.target.value || null)}
            placeholder="📖"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Course content</label>
        <RichTextEditor value={values.contentHtml} onChange={(html) => set("contentHtml", html)} />
      </div>

      <fieldset className="rounded-lg border border-border p-4 space-y-4">
        <legend className="px-1 text-sm text-muted">FAQs</legend>
        {values.faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border border-border bg-background p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-2">FAQ {i + 1}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => moveFaq(i, -1)}
                  disabled={i === 0}
                  className="text-xs text-muted hover:text-foreground disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveFaq(i, 1)}
                  disabled={i === values.faqs.length - 1}
                  className="text-xs text-muted hover:text-foreground disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="text-xs text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
            <input
              value={faq.question}
              onChange={(e) => setFaq(i, "question", e.target.value)}
              placeholder="Question"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <textarea
              value={faq.answer}
              onChange={(e) => setFaq(i, "answer", e.target.value)}
              placeholder="Answer"
              rows={2}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addFaq}
          className="text-sm text-primary hover:underline"
        >
          + Add FAQ
        </button>
      </fieldset>

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
          category="courses"
          value={values.ogImage}
          onChange={(v) => set("ogImage", v)}
        />
      </fieldset>

      <div className="flex items-center gap-6">
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
        {saving ? "Saving…" : values.id ? "Save changes" : "Create course"}
      </button>
    </form>
  );
}
