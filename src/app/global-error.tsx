"use client";

import { useEffect } from "react";
import Link from "next/link";
import "../styles.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Root Layout Error:", error);
  }, [error]);

  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
        <div className="max-w-md w-full rounded-2xl border border-border/60 bg-card p-8 sm:p-10 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <i className="ri-alarm-warning-line text-3xl" />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-brand mb-2">
            গুরুতর সিস্টেম ত্রুটি
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            অ্যাপ্লিকেশনের মূল কাঠামোতে সাময়িক সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পৃষ্ঠাটি পুনরায়
            লোড করুন।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer"
            >
              <i className="ri-refresh-line" /> পুনরায় লোড করুন
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <i className="ri-home-4-line" /> হোমপেজ
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
