import { NextRequest } from "next/server";
import { createPost, listPosts, storeErrorResponse } from "@/lib/store";
import { normalizePage, normalizePageSize, parseTags, validatePost } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const result = await listPosts({
    q: sp.get("q") ?? "",
    tag: sp.get("tag") ?? "",
    page: normalizePage(sp.get("page")),
    pageSize: normalizePageSize(sp.get("pageSize")),
  });
  return Response.json(result);
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
  try {
    const post = await createPost({
      title: String(body.title),
      content: String(body.content),
      tags,
    });
    return Response.json(post, { status: 201 });
  } catch (e) {
    return storeErrorResponse(e);
  }
}
