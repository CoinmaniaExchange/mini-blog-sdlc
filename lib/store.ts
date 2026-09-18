import type { Comment as PrismaComment, Post as PrismaPost } from "../src/generated/prisma/client";
import { prisma } from "./prisma";
import type { Comment, Post, PostInput, CommentInput } from "./types";

function toPost(p: PrismaPost): Post {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    tags: p.tags,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function toComment(c: PrismaComment): Comment {
  return {
    id: c.id,
    postId: c.postId,
    authorName: c.authorName,
    text: c.text,
    createdAt: c.createdAt.toISOString(),
  };
}

// Vercel-ზე (read-only FS) ჩაწერა EROFS-ით ვარდება —
// მაგ შემთხვევაში ვაბრუნებთ 503-ს პატიოსანი ქართული მესიჯით.
export function storeErrorResponse(e: unknown): Response {
  const code = (e as NodeJS.ErrnoException | null)?.code;
  if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
    return Response.json(
      { error: "დემო რეჟიმში შენახვა მიუწვდომელია" },
      { status: 503 }
    );
  }
  return Response.json({ error: "სერვერის შეცდომა" }, { status: 500 });
}

export async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return posts.map(toPost);
}

export async function getPost(id: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({ where: { id } });
  return post ? toPost(post) : null;
}

export async function createPost(input: PostInput): Promise<Post> {
  const post = await prisma.post.create({
    data: {
      title: input.title.trim(),
      content: input.content.trim(),
      tags: input.tags,
    },
  });
  return toPost(post);
}

function isNotFound(e: unknown): boolean {
  return (e as { code?: string })?.code === "P2025";
}

export async function updatePost(
  id: string,
  input: PostInput
): Promise<Post | null> {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: input.title.trim(),
        content: input.content.trim(),
        tags: input.tags,
      },
    });
    return toPost(post);
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await prisma.post.delete({ where: { id } });
    return true;
  } catch (e) {
    if (isNotFound(e)) return false;
    throw e;
  }
}

export async function getComments(postId: string): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
  });
  return comments.map(toComment);
}

export async function createComment(
  postId: string,
  input: CommentInput
): Promise<Comment> {
  const comment = await prisma.comment.create({
    data: {
      postId,
      authorName: input.authorName.trim(),
      text: input.text.trim(),
    },
  });
  return toComment(comment);
}

export const PAGE_SIZE = 5;

export interface PagedPosts {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
}

function buildWhere(query: string, t: string) {
  return {
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { content: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {},
      t ? { tags: { has: t } } : {},
    ],
  };
}

export async function listPosts(opts: {
  q?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedPosts> {
  const query = (opts.q ?? "").trim();
  const t = (opts.tag ?? "").trim().toLowerCase();
  const pageSize = Math.min(Math.max(opts.pageSize ?? PAGE_SIZE, 1), 50);
  const page = Math.max(opts.page ?? 1, 1);
  const where = buildWhere(query, t);
  const [total, rows] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { posts: rows.map(toPost), total, page, pageSize };
}

export async function searchPosts(q: string, tag: string): Promise<Post[]> {
  const { posts } = await listPosts({ q, tag, page: 1, pageSize: 1000 });
  return posts;
}

export async function getAllTags(): Promise<string[]> {
  const posts = await prisma.post.findMany({ select: { tags: true } });
  const set = new Set<string>();
  posts.forEach((p) => p.tags.forEach((tag) => set.add(tag)));
  return [...set].sort();
}
