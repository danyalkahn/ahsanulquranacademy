"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  endpoint,
  confirmText = "Delete this item?",
}: {
  endpoint: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!window.confirm(confirmText)) return;
    setLoading(true);
    try {
      await fetch(endpoint, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
