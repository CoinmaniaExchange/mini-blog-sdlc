import { deletePost, getPost, updatePost } from "@/lib/store";
import { parseTags, validatePost } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/posts/[id]">
) {
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) {
    return Response.json({ error: "პოსტი ვერ მოიძებნა" }, { status: 404 });
  }
  return Response.json(post);
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/posts/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }
  const tags = Array.isArray(body.tags)
    ? body.tags
    : parseTags(String(body.tags ?? ""));
  const errors = validatePost({
    title: String(body.title ?? ""),
    content: String(body.content ?? ""),
    tags,
  });
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "ვალიდაცია ვერ გაიარა", errors }, { status: 400 });
  }
  const updated = await updatePost(id, {
    title: String(body.title),
    content: String(body.content),
    tags,
  });
  if (!updated) {
    return Response.json({ error: "პოსტი ვერ მოიძებნა" }, { status: 404 });
  }
  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/posts/[id]">
) {
  const { id } = await ctx.params;
  const ok = await deletePost(id);
  if (!ok) {
    return Response.json({ error: "პოსტი ვერ მოიძებნა" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
