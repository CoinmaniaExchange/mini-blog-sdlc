// E2E API სცენარი: პოსტი -> კომენტარი -> რედაქტირება -> წაშლა
// გაშვება: BASE_URL=http://localhost:3102 node scripts/e2e-api.mjs
const BASE = process.env.BASE_URL || "http://localhost:3102";

let passed = 0;
let failed = 0;

function check(name, cond, extra = "") {
  if (cond) {
    passed++;
    console.log(`✅ ${name}`);
  } else {
    failed++;
    console.log(`❌ ${name} ${extra}`);
  }
}

const res = await fetch(`${BASE}/api/posts`);
const list = await res.json();
check("სიის წამოღება (seed პოსტები)", res.ok && list.length >= 3, `got=${list?.length}`);

// 1. შექმნა
const createRes = await fetch(`${BASE}/api/posts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "E2E სატესტო პოსტი",
    content: "ეს არის E2E ტესტის კონტენტი, რომელიც 20 სიმბოლოზე გრძელია.",
    tags: ["e2e", "ტესტი"],
  }),
});
const created = await createRes.json();
check("პოსტის შექმნა", createRes.status === 201 && created.id, JSON.stringify(created).slice(0, 200));
const id = created.id;

// 2. ვალიდაცია უარყოფს მოკლეს
const badRes = await fetch(`${BASE}/api/posts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "აბ", content: "მოკლე", tags: [] }),
});
check("ვალიდაცია ბლოკავს მოკლე პოსტს (400)", badRes.status === 400);

// 3. დეტალი
const getRes = await fetch(`${BASE}/api/posts/${id}`);
check("დეტალის წამოღება", getRes.ok);

// 4. კომენტარი (ანონიმური)
const cRes = await fetch(`${BASE}/api/posts/${id}/comments`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ authorName: "", text: "E2E კომენტარი" }),
});
const comment = await cRes.json();
check("ანონიმური კომენტარი", cRes.status === 201 && comment.id);

// 5. რედაქტირება
const putRes = await fetch(`${BASE}/api/posts/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "E2E სატესტო პოსტი (რედაქტირებული)",
    content: "განახლებული კონტენტი, რომელიც საკმარისად გრძელია.",
    tags: ["e2e"],
  }),
});
check("რედაქტირება", putRes.ok);

// 6. წაშლა + 404 შემოწმება
const delRes = await fetch(`${BASE}/api/posts/${id}`, { method: "DELETE" });
check("წაშლა", delRes.ok);
const afterDel = await fetch(`${BASE}/api/posts/${id}`);
check("წაშლილი პოსტი → 404", afterDel.status === 404);

console.log(`\nშედეგი: ${passed} გავლილი, ${failed} წარუმატებელი`);
process.exit(failed > 0 ? 1 : 0);
