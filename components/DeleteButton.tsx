"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("დარწმუნებული ხარ რომ გინდა წაშლა?")) return;
    setBusy(true);
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="rounded-full border border-red-200 px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
    >
      {busy ? "იშლება..." : "წაშლა"}
    </button>
  );
}
