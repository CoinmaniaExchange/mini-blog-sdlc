import Link from "next/link";
import type { Post } from "@/lib/types";
import { excerpt } from "@/lib/validation";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-lg font-semibold text-zinc-900 hover:underline dark:text-zinc-50">
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{excerpt(post.content)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/?tag=${encodeURIComponent(tag)}`}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            #{tag}
          </Link>
        ))}
        <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
          {new Date(post.createdAt).toLocaleDateString("ka-GE")}
        </span>
      </div>
    </article>
  );
}
