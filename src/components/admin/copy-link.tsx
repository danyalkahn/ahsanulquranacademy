"use client";

import { useState } from "react";

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — no-op, the URL is still visible/selectable
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5">
      <code className="flex-1 overflow-x-auto whitespace-nowrap text-sm text-foreground/90">{url}</code>
      <button
        onClick={copy}
        className="shrink-0 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
