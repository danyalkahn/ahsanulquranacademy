"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/admin/delete-button";

export default function MessageActions({
  id,
  read,
  endpointBase,
}: {
  id: number;
  read: boolean;
  endpointBase: "messages" | "trial-requests";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markRead() {
    setLoading(true);
    try {
      await fetch(`/api/admin/${endpointBase}/${id}`, { method: "PATCH" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {!read && (
        <button
          onClick={markRead}
          disabled={loading}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          Mark as read
        </button>
      )}
      <DeleteButton endpoint={`/api/admin/${endpointBase}/${id}`} confirmText="Delete this message?" />
    </div>
  );
}
