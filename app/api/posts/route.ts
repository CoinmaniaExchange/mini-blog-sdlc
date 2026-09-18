import { NextRequest } from "next/server";
import { createPost, searchPosts } from "@/lib/store";
import { parseTags, validatePost } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const tag = request.nextUrl.searchParams.get("tag") ?? "";
  const posts = await searchPosts(q, tag);
  return Response.json(posts);
}

export async function POST(request: Request) {
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
  const post = await createPost({
    title: String(body.title),
    content: String(body.content),
    tags,
  });
  return Response.json(post, { status: 201 });
}
