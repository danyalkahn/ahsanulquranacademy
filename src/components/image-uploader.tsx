"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import type { UploadCategory } from "@/lib/uploads";

type MediaItem = { path: string; category: string };

function MediaLibraryModal({
  onSelect,
  onClose,
}: {
  onSelect: (path: string) => void;
  onClose: () => void;
}) {
  const [media, setMedia] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((data) => setMedia(data.media || []))
      .catch(() => setError("Failed to load media library"));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Media library</h3>
          <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
            ✕
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {!media && !error && <p className="text-sm text-muted">Loading…</p>}
        {media && media.length === 0 && (
          <p className="text-sm text-muted">No previously uploaded images yet.</p>
        )}

        {media && media.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {media.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  onSelect(item.path);
                  onClose();
                }}
                className="group relative overflow-hidden rounded-lg border border-border hover:border-primary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.path} alt="" className="h-20 w-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/70 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
                  {item.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImageUploader({
  value,
  onChange,
  category,
  label,
}: {
  value: string | null;
  onChange: (path: string | null) => void;
  category: UploadCategory;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.path);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <label className="block text-sm text-muted mb-1.5">{label}</label>}
      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt=""
            width={160}
            height={100}
            className="rounded-lg border border-border object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-xs w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-muted hover:border-primary hover:text-foreground"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-24 w-40 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted hover:border-primary">
            {uploading ? "Uploading…" : "Upload image"}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onFileSelected}
            />
          </label>
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            className="text-xs text-primary-light hover:underline"
          >
            Browse library
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {showLibrary && (
        <MediaLibraryModal onSelect={(path) => onChange(path)} onClose={() => setShowLibrary(false)} />
      )}
    </div>
  );
}
