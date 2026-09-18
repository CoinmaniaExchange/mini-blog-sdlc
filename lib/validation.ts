export function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .slice(0, 5);
}

export function validatePost(data: {
  title: string;
  content: string;
  tags: string[];
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = (data.title ?? "").trim();
  const content = (data.content ?? "").trim();

  if (title.length < 5) errors.title = "სათაური მინიმუმ 5 სიმბოლოა";
  else if (title.length > 120) errors.title = "სათაური მაქსიმუმ 120 სიმბოლოა";

  if (content.length < 20) errors.content = "კონტენტი მინიმუმ 20 სიმბოლოა";
  else if (content.length > 10000)
    errors.content = "კონტენტი მაქსიმუმ 10000 სიმბოლოა";

  if (data.tags.length > 5) errors.tags = "მაქსიმუმ 5 თეგი";
  for (const tag of data.tags) {
    if (tag.length < 2 || tag.length > 20) {
      errors.tags = "თითო თეგი 2-20 სიმბოლო უნდა იყოს";
      break;
    }
  }
  return errors;
}

export function validateComment(data: {
  authorName: string;
  text: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const text = (data.text ?? "").trim();
  const authorName = (data.authorName ?? "").trim();

  if (text.length < 2) errors.text = "კომენტარი მინიმუმ 2 სიმბოლოა";
  else if (text.length > 500)
    errors.text = "კომენტარი მაქსიმუმ 500 სიმბოლოა";

  if (authorName.length > 30) errors.authorName = "სახელი მაქსიმუმ 30 სიმბოლოა";
  return errors;
}

export function excerpt(content: string, length = 120): string {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length <= length ? flat : flat.slice(0, length) + "…";
}

export function normalizePage(raw: unknown): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s == null || s === "") return 1;
  const n = Math.floor(Number(s));
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function normalizePageSize(raw: unknown, def = 5): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s == null || s === "") return def;
  const n = Math.floor(Number(s));
  if (!Number.isFinite(n)) return def;
  return Math.min(Math.max(n, 1), 50);
}
