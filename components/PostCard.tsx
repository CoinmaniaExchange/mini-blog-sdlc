import Link from "next/link";
import type { Post } from "@/lib/types";
import { excerpt } from "@/lib/validation";

const PILL_COLORS: Array<{ bg: string; fg: string }> = [
  { bg: "#eef2ff", fg: "#4338ca" },
  { bg: "#ecfdf5", fg: "#047857" },
  { bg: "#fff7ed", fg: "#c2410c" },
  { bg: "#fdf2f8", fg: "#be185d" },
  { bg: "#eff6ff", fg: "#1d4ed8" },
  { bg: "#fefce8", fg: "#a16207" },
];

function pillStyle(tag: string): { backgroundColor: string; color: string } {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  const c = PILL_COLORS[h % PILL_COLORS.length];
  return { backgroundColor: c.bg, color: c.fg };
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/?tag=${encodeURIComponent(tag)}`}
            style={pillStyle(tag)}
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <Link href={`/posts/${post.id}`}>
        <h2 className="mt-3 text-xl font-bold leading-snug text-zinc-900 group-hover:underline">
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
        {excerpt(post.content, 160)}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
        <span className="text-xs text-zinc-400">
          {new Date(post.createdAt).toLocaleDateString("ka-GE")}
        </span>
        <Link
          href={`/posts/${post.id}`}
          className="text-sm font-semibold text-zinc-900 transition group-hover:translate-x-0.5"
        >
          კითხვის გაგრძელება →
        </Link>
      </div>
    </article>
  );
}
