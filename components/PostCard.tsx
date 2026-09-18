import Link from "next/link";
import type { Post } from "@/lib/types";
import { excerpt } from "@/lib/validation";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-lg font-semibold text-zinc-900 hover:underline">
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 text-sm text-zinc-600">{excerpt(post.content)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/?tag=${encodeURIComponent(tag)}`}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 hover:bg-zinc-200"
          >
            #{tag}
          </Link>
        ))}
        <span className="ml-auto text-xs text-zinc-400">
          {new Date(post.createdAt).toLocaleDateString("ka-GE")}
        </span>
      </div>
    </article>
  );
}
