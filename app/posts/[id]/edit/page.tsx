import { notFound } from "next/navigation";
import PostForm from "@/components/PostForm";
import { getPost } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function EditPostPage(props: PageProps<"/posts/[id]/edit">) {
  const { id } = await props.params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <main className="rounded-xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="mb-4 text-xl font-bold">პოსტის რედაქტირება</h1>
      <PostForm initial={post} />
    </main>
  );
}
