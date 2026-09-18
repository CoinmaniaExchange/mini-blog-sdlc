import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getAllTags, searchPosts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const q =
    typeof searchParams?.q === "string" ? searchParams.q : "";
  const tag =
    typeof searchParams?.tag === "string" ? searchParams.tag : "";

  const [posts, tags] = await Promise.all([
    searchPosts(q, tag),
    getAllTags(),
  ]);

  return (
    <main className="space-y-5">
      <form method="get" className="flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="ძებნა სათაურით..."
          className="flex-1 rounded-lg border bg-white px-3 py-2"
        />
        <select
          name="tag"
          defaultValue={tag}
          className="rounded-lg border bg-white px-3 py-2"
        >
          <option value="">ყველა თეგი</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-white">
          ძებნა
        </button>
      </form>

      {(q || tag) && (
        <div className="text-sm text-zinc-600">
          {posts.length} შედეგი
          {q && (
            <>
              {" "}
              ძებნაზე: <b>{q}</b>
            </>
          )}
          {tag && (
            <>
              {" "}
              თეგი: <b>#{tag}</b>
            </>
          )}{" "}
          <Link href="/" className="ml-2 underline">
            გასუფთავება
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-lg font-medium">პოსტები არ მოიძებნა</p>
          <p className="mt-1 text-sm text-zinc-500">
            სცადე სხვა ძებნა ან შექმენი ახალი პოსტი
          </p>
          <Link
            href="/posts/new"
            className="mt-4 inline-block rounded-full bg-zinc-900 px-5 py-2 text-sm text-white"
          >
            + ახალი პოსტი
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
