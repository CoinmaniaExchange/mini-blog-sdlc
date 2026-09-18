# მინი ბლოგი — SDLC სასწავლო პროექტი

Next.js + TypeScript-ზე აწყობილი ქართული მინი ბლოგი, რომელზეც სრული SDLC ციკლი გავიარეთ სასწავლად: დაგეგმვა → დიზაინი → იმპლემენტაცია → ტესტირება → დეპლოი → მხარდაჭერა. მეთოდოლოგია: Kanban.

- Production: https://mini-blog-sdlc.vercel.app/
- Repo: https://github.com/CoinmaniaExchange/mini-blog-sdlc

## ფუნქციონალი (MVP)

- პოსტების სია, ძებნა სათაურით, ფილტრი თეგით
- პოსტის დეტალი + შექმნა / რედაქტირება / წაშლა (დასტურით)
- ანონიმური კომენტარები (სახელის გარეშე = "ანონიმი")
- ვალიდაცია ქართული ერორებით: სათაური min 5, კონტენტი min 20, კომენტარი min 2
- რესპონსიული UI (Tailwind)

## გაშვება

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # unit ტესტები (vitest)
npm run lint
npm run build
```

E2E API სცენარი (საჭიროებს გაშვებულ სერვერს):

```bash
PORT=3102 npm run dev -- --port 3102 &
BASE_URL=http://localhost:3102 node scripts/e2e-api.mjs
```

## API

| მეთოდი | გზა | აღწერა |
|---|---|---|
| GET | `/api/posts?q=&tag=` | სია + ძებნა/ფილტრი |
| POST | `/api/posts` | შექმნა `{title, content, tags}` |
| GET | `/api/posts/:id` | დეტალი |
| PUT | `/api/posts/:id` | რედაქტირება |
| DELETE | `/api/posts/:id` | წაშლა |
| GET/POST | `/api/posts/:id/comments` | კომენტარები |

## სტრუქტურა

```
app/            # გვერდები (ka) + Route Handlers API
components/     # PostCard, PostForm, CommentForm, DeleteButton
lib/            # types, validation, store (JSON file)
data/           # posts.json, comments.json (seed)
scripts/        # e2e-api.mjs
.github/workflows/ci.yml  # lint + test + build
```

## ცნობილი შეზღუდვები (სასწავლო)

- მონაცემები JSON ფაილში ინახება — Vercel-ზე (serverless) ჩაწერა არ პერსისტდება, დემო რესტარტზე უბრუნდება seed-ს.
- v2 იდეები: hosted DB (Neon Postgres + Prisma), ავტორიზაცია, სურათები, pagination, Playwright E2E.

## SDLC დღიური

1. დაგეგმვა: scope MVP vs v2, 7 user story, Kanban (`Backlog → To Do → In Progress → Review → Done`, WIP 2-3)
2. დიზაინი: 4 გვერდი, API კონტრაქტი, `Post`/`Comment` მოდელები
3. იმპლემენტაცია: Next.js App Router, `params`/`searchParams` Promise-ები (Next 16)
4. ტესტირება: 11 unit + 8 E2E ნაბიჯი, ყველა მწვანე
5. დეპლოი: GitHub + CI + Vercel
6. მხარდაჭერა: ბაგები — GitHub Issues-ით, ეტიკეტები `bug`/`enhancement`
