import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-2xl border border-border/60 bg-card p-8 sm:p-10 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <i className="ri-compass-discover-line text-3xl" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-pink mb-1">
            ৪০৪ · পৃষ্ঠা পাওয়া যায়নি
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand mb-2">
            দুঃখিত, এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            আপনি যে লিঙ্কটি খুঁজছেন তা হয়তো পরিবর্তন করা হয়েছে অথবা বর্তমানে উপলব্ধ নয়।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all"
            >
              <i className="ri-home-4-line" /> হোম পেজে ফিরুন
            </Link>
            <Link
              href="/biodatas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-all"
            >
              <i className="ri-search-line" /> বায়োডাটা খুঁজুন
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
