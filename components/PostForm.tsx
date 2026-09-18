"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseTags } from "@/lib/validation";
import type { Post } from "@/lib/types";

export default function PostForm({ initial }: { initial?: Post }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = initial ? `/api/posts/${initial.id}` : "/api/posts";
      const res = await fetch(url, {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          tags: parseTags(tags),
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        id?: string;
        error?: string;
        errors?: Record<string, string>;
      } | null;
      if (!res.ok) {
        const first = data?.errors && Object.values(data.errors)[0];
        setError(String(first ?? data?.error ?? `შეცდომა (${res.status})`));
        return;
      }
      if (!data?.id) {
        setError("სერვერმა ცარიელი პასუხი დააბრუნა");
        return;
      }
      router.push(`/posts/${data.id}`);
      router.refresh();
    } catch {
      setError("ქსელის შეცდომა. შეამოწმე ინტერნეტი");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          სათაური (მინ. 5)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="მაგ: ჩემი პირველი პოსტი"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          კონტენტი (მინ. 20)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="დაწერე პოსტის ტექსტი ქართულად..."
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          თეგები (მძიმით, მაგ: nextjs, sdlc)
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          disabled={saving}
          className="rounded-full bg-zinc-900 px-5 py-2 text-white disabled:opacity-50"
        >
          {saving ? "ინახება..." : "შენახვა"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border px-5 py-2"
        >
          გაუქმება
        </button>
      </div>
    </form>
  );
}
