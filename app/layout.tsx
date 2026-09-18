import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans_Georgian } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-sans-ka",
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "მინი ბლოგი",
  description: "SDLC სასწავლო პროექტი - Next.js + TypeScript",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ka"
      suppressHydrationWarning
      className={`${notoSansGeorgian.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="border-b bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold dark:text-zinc-50">
              მინი ბლოგი
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/posts/new"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-white dark:bg-white dark:text-zinc-900"
              >
                + ახალი პოსტი
              </Link>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</div>
        <footer className="border-t bg-white py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          SDLC სასწავლო პროექტი · Next.js + TS · Kanban
        </footer>
      </body>
    </html>
  );
}
