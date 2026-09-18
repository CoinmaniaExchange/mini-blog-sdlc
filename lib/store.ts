import { promises as fs } from "fs";
import path from "path";
import type { Comment, Post, PostInput, CommentInput } from "./types";

const dataDir = path.join(process.cwd(), "data");
const postsFile = path.join(dataDir, "posts.json");
const commentsFile = path.join(dataDir, "comments.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export async function getPosts(): Promise<Post[]> {
  const posts = await readJson<Post[]>(postsFile, []);
  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(id: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export async function createPost(input: PostInput): Promise<Post> {
  const posts = await getPosts();
  const now = new Date().toISOString();
  const post: Post = {
    id: uid(),
    title: input.title.trim(),
    content: input.content.trim(),
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
  };
  await writeJson(postsFile, [post, ...posts]);
  return post;
}

export async function updatePost(
  id: string,
  input: PostInput
): Promise<Post | null> {
  const posts = await getPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: Post = {
    ...posts[idx],
    title: input.title.trim(),
    content: input.content.trim(),
    tags: input.tags,
    updatedAt: new Date().toISOString(),
  };
  posts[idx] = updated;
  await writeJson(postsFile, posts);
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  await writeJson(postsFile, filtered);
  const comments = await readJson<Comment[]>(commentsFile, []);
  await writeJson(
    commentsFile,
    comments.filter((c) => c.postId !== id)
  );
  return true;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const comments = await readJson<Comment[]>(commentsFile, []);
  return comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createComment(
  postId: string,
  input: CommentInput
): Promise<Comment> {
  const comments = await readJson<Comment[]>(commentsFile, []);
  const comment: Comment = {
    id: uid(),
    postId,
    authorName: input.authorName.trim(),
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
  };
  await writeJson(commentsFile, [...comments, comment]);
  return comment;
}

export async function searchPosts(q: string, tag: string): Promise<Post[]> {
  const posts = await getPosts();
  const query = q.trim().toLowerCase();
  return posts.filter((p) => {
    const matchQ =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.content.toLowerCase().includes(query);
    const matchTag = !tag || p.tags.includes(tag.toLowerCase());
    return matchQ && matchTag;
  });
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts();
  const set = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return [...set].sort();
}
