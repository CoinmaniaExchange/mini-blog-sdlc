// JSON seed-ის გადატანა Neon Postgres-ში.
// გაშვება: set -a; source ./.env; set +a; node scripts/seed-neon.mjs
import pg from "pg";
import fs from "node:fs";

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const posts = JSON.parse(fs.readFileSync("data/posts.json", "utf-8"));
const comments = JSON.parse(fs.readFileSync("data/comments.json", "utf-8"));

for (const p of posts) {
  await client.query(
    `INSERT INTO "Post" (id, title, content, tags, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO NOTHING`,
    [p.id, p.title, p.content, p.tags, new Date(p.createdAt), new Date(p.updatedAt)]
  );
}

for (const c of comments) {
  await client.query(
    `INSERT INTO "Comment" (id, "postId", "authorName", text, "createdAt")
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO NOTHING`,
    [c.id, c.postId, c.authorName ?? "", c.text, new Date(c.createdAt)]
  );
}

const { rows } = await client.query(
  `SELECT (SELECT COUNT(*) FROM "Post") AS posts, (SELECT COUNT(*) FROM "Comment") AS comments`
);
console.log("Seed OK:", rows[0]);
await client.end();
