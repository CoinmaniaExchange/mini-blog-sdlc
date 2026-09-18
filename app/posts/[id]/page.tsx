import Link from "next/link";
import { notFound } from "next/navigation";
import CommentForm from "@/components/CommentForm";
import DeleteButton from "@/components/DeleteButton";
import { getComments, getPost } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PostDetail(props: PageProps<"/posts/[id]">) {
  const { id } = await props.params;
  const post = await getPost(id);
  if (!post) notFound();

  const comments = await getComments(id);

  return (
    <main className="space-y-5">
      <Link href="/" className="text-sm underline">
        ← უკან დაბრუნება
      </Link>

      <article className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
          <span>{new Date(post.createdAt).toLocaleString("ka-GE")}</span>
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/?tag=${encodeURIComponent(t)}`}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-zinc-700"
            >
              #{t}
            </Link>
          ))}
        </div>
        <p className="mt-4 whitespace-pre-wrap leading-7">{post.content}</p>
        <div className="mt-6 flex gap-2">
          <Link
            href={`/posts/${post.id}/edit`}
            className="rounded-full border px-4 py-1.5 text-sm hover:bg-zinc-100"
          >
            რედაქტირება
          </Link>
          <DeleteButton id={post.id} />
        </div>
      </article>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold">კომენტარები ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            ჯერ კომენტარი არ არის — იყავი პირველი!
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="rounded-lg bg-zinc-50 p-3">
                <div className="text-xs text-zinc-500">
                  {c.authorName || "ანონიმი"} ·{" "}
                  {new Date(c.createdAt).toLocaleString("ka-GE")}
                </div>
                <div className="mt-1 text-sm">{c.text}</div>
              </li>
            ))}
          </ul>
        )}
        <CommentForm postId={post.id} />
      </section>
    </main>
  );
}
