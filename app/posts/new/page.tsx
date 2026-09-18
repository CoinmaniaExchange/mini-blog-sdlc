import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <main className="rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">ახალი პოსტი</h1>
      <PostForm />
    </main>
  );
}
