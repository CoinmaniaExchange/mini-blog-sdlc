import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getAllTags, listPosts } from "@/lib/store";
import { normalizePage } from "@/lib/validation";

export const dynamic = "force-dynamic";

function pageHref(q: string, tag: string, page: number): string {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (tag) sp.set("tag", tag);
  if (page > 1) sp.set("page", String(page));
  const s = sp.toString();
  return s ? `/?${s}` : "/";
}

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const q =
    typeof searchParams?.q === "string" ? searchParams.q : "";
  const tag =
    typeof searchParams?.tag === "string" ? searchParams.tag : "";
  const requestedPage = normalizePage(searchParams?.page);

  const tags = await getAllTags();
  let result = await listPosts({ q, tag, page: requestedPage });
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  if (requestedPage > totalPages) {
    result = await listPosts({ q, tag, page: totalPages });
  }
  const { posts, total, page, pageSize } = result;

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

      <div className="text-sm text-zinc-600">
        სულ {total} პოსტი
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
        )}
        {(q || tag) && (
          <Link href="/" className="ml-2 underline">
            გასუფთავება
          </Link>
        )}
      </div>

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

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3 pt-2">
          {page > 1 ? (
            <Link
              href={pageHref(q, tag, page - 1)}
              className="rounded-full border bg-white px-4 py-1.5 text-sm hover:bg-zinc-100"
            >
              ‹ წინა
            </Link>
          ) : (
            <span className="rounded-full border bg-zinc-100 px-4 py-1.5 text-sm text-zinc-400">
              ‹ წინა
            </span>
          )}
          <span className="text-sm text-zinc-600">
            გვერდი {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={pageHref(q, tag, page + 1)}
              className="rounded-full border bg-white px-4 py-1.5 text-sm hover:bg-zinc-100"
            >
              შემდეგი ›
            </Link>
          ) : (
            <span className="rounded-full border bg-zinc-100 px-4 py-1.5 text-sm text-zinc-400">
              შემდეგი ›
            </span>
          )}
        </nav>
      )}
      {total > 0 && total <= pageSize && (
        <p className="text-center text-xs text-zinc-400">
          ყველა პოსტი ერთ გვერდზეა
        </p>
      )}
    </main>
  );
}
