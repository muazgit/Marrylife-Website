import Link from "next/link";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "বিনামূল্যে বায়োডাটা তৈরি করুন | MarryLife",
  description: "শরীয়াহসম্মত উপায়ে আপনার অথবা আপনার পরিবারের সদস্যের বায়োডাটা তৈরি করুন।",
};

export default function CreateBiodataPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <section className="bg-lavender border-b border-border/40 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand mb-3">
            বায়োডাটা ফর্ম
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand">
            বিনামূল্যে বায়োডাটা তৈরি করুন
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            শরীয়াহসম্মত উপায়ে আপনার অথবা আপনার পরিবারের সদস্যের বায়োডাটা যুক্ত করুন।
          </p>
        </div>
      </section>

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-5">
          <div className="rounded-xl border border-gray-100 bg-card p-6 shadow-xs">
            <h2 className="text-base sm:text-lg font-extrabold text-brand mb-2">
              বায়োডাটা তৈরির পূর্বশর্ত
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed list-disc pl-5">
              <li>পাঁচ ওয়াক্ত নামাজি হওয়া।</li>
              <li>
                পাত্রের ক্ষেত্রে সুন্নতি দাড়ি এবং পাত্রীর ক্ষেত্রে শরীয়াহসম্মত পর্দা পালন করা।
              </li>
              <li>অভিভাবকের পূর্ণ অবগতি ও সম্মতি থাকা।</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all"
            >
              <span>লগইন করে শুরু করুন</span>
              <i className="ri-arrow-right-line" />
            </Link>
            <Link
              href="/biodatas"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-all"
            >
              সকল বায়োডাটা দেখুন
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
