"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, text }),
    });
    let data: { error?: string; errors?: Record<string, string> } | null = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const first = data?.errors && Object.values(data.errors)[0];
      setError(String(first ?? data?.error ?? `შეცდომა (${res.status})`));
      return;
    }
    setText("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-xl border p-4">
      <h3 className="font-medium">კომენტარის დამატება</h3>
      <input
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="სახელი (არასავალდებულო, ცარიელი = ანონიმი)"
        className="w-full rounded-lg border px-3 py-2"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="დაწერე კომენტარი..."
        rows={3}
        className="w-full rounded-lg border px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white">
        გაგზავნა
      </button>
    </form>
  );
}
