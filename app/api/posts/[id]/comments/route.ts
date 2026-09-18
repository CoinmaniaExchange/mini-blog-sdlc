import { createComment, getComments, getPost } from "@/lib/store";
import { validateComment } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/posts/[id]/comments">
) {
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) {
    return Response.json({ error: "პოსტი ვერ მოიძებნა" }, { status: 404 });
  }
  return Response.json(await getComments(id));
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/posts/[id]/comments">
) {
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) {
    return Response.json({ error: "პოსტი ვერ მოიძებნა" }, { status: 404 });
  }
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }
  const errors = validateComment({
    authorName: String(body.authorName ?? ""),
    text: String(body.text ?? ""),
  });
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "ვალიდაცია ვერ გაიარა", errors }, { status: 400 });
  }
  const comment = await createComment(id, {
    authorName: String(body.authorName ?? ""),
    text: String(body.text),
  });
  return Response.json(comment, { status: 201 });
}
