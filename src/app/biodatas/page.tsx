import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { BiodataCard } from "@/components/biodata-card";
import { BiodataFilters } from "@/components/biodata-filters";
import { BiodataPagination } from "@/components/biodata-pagination";
import { toBengaliNumber } from "@/lib/utils/bengali";

/* ---------- Constants ---------- */

const PAGE_SIZE = 6;

/* ---------- Page (Server Component) ---------- */

export const metadata = {
  title: "বায়োডাটা খুঁজুন | MarryLife",
  description:
    "দ্বীনদার পাত্র-পাত্রীর বায়োডাটা খুঁজুন — বিভাগ, পেশা ও দ্বীনি বৈশিষ্ট্য অনুযায়ী ফিল্টার করুন।",
};

interface PageProps {
  searchParams: Promise<{
    gender?: string;
    marital_status?: string;
    division?: string;
    page?: string;
  }>;
}

export default async function BiodatasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const gender = params.gender || undefined;
  const maritalStatus = params.marital_status || undefined;
  const division = params.division || undefined;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  /* ---- Fetch from Supabase ---- */
  const supabase = await createClient();

  // Build query for approved biodatas only
  let query = supabase
    .from("biodatas")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Apply filters
  if (gender === "groom" || gender === "bride") {
    query = query.eq("gender", gender);
  }
  if (
    maritalStatus === "never_married" ||
    maritalStatus === "divorced" ||
    maritalStatus === "widowed" ||
    maritalStatus === "separated"
  ) {
    query = query.eq("marital_status", maritalStatus);
  }
  if (division) {
    query = query.eq("permanent_division", division);
  }

  // Pagination
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data: biodatas, count, error } = await query;

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* ---- Active filter labels for breadcrumb ---- */
  const GENDER_LABELS: Record<string, string> = {
    groom: "পাত্রের",
    bride: "পাত্রীর",
  };

  const activeFilterLabels: string[] = [];
  if (gender) activeFilterLabels.push(GENDER_LABELS[gender] || gender);
  if (division) activeFilterLabels.push(division);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="bg-lavender border-b border-border/40 pt-6 pb-6 sm:pt-8 sm:pb-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Link href="/" className="hover:text-brand transition-colors">
              <i className="ri-home-4-line text-sm" /> হোম
            </Link>
            <i className="ri-arrow-right-s-line text-sm" />
            <span className="text-foreground font-semibold">বায়োডাটা সমূহ</span>
          </nav>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand">
            {activeFilterLabels.length > 0 ? (
              <>
                {activeFilterLabels.join(" · ")}{" "}
                <span className="text-brand-pink">বায়োডাটা সমূহ</span>
              </>
            ) : (
              <>
                সকল <span className="text-brand-pink">বায়োডাটা</span> সমূহ
              </>
            )}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            মোট <span className="font-bold text-foreground">{toBengaliNumber(totalCount)}</span> টি
            যাচাইকৃত বায়োডাটা পাওয়া গেছে
          </p>
        </div>
      </section>

      {/* Main content: Filters + Grid */}
      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
            {/* Filter sidebar */}
            <Suspense fallback={null}>
              <BiodataFilters />
            </Suspense>

            {/* Content area */}
            <div className="min-w-0">
              {error ? (
                /* Error state */
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                  <i className="ri-error-warning-line text-3xl text-red-500 mb-3" />
                  <h3 className="text-base font-bold text-red-800 mb-1">
                    তথ্য লোড করতে সমস্যা হয়েছে
                  </h3>
                  <p className="text-sm text-red-600">দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
                </div>
              ) : !biodatas || biodatas.length === 0 ? (
                /* Empty state */
                <div className="rounded-xl border border-gray-100 dark:border-border/60 bg-card p-10 sm:p-16 text-center shadow-xs">
                  <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-brand/10">
                    <i className="ri-search-eye-line text-3xl sm:text-4xl text-brand" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                    কোনো বায়োডাটা পাওয়া যায়নি
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    আপনার নির্বাচিত ফিল্টারের সাথে কোনো যাচাইকৃত বায়োডাটা মিলেনি। ফিল্টার পরিবর্তন
                    করে আবার চেষ্টা করুন।
                  </p>
                  <Link
                    href="/biodatas"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-sm hover:bg-brand/90 transition-all"
                  >
                    <i className="ri-filter-off-line" /> সকল বায়োডাটা দেখুন
                  </Link>
                </div>
              ) : (
                /* Results grid */
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
                    {biodatas.map((biodata) => (
                      <BiodataCard key={biodata.id} biodata={biodata} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8 sm:mt-10">
                    <Suspense fallback={null}>
                      <BiodataPagination currentPage={currentPage} totalPages={totalPages} />
                    </Suspense>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="bg-footer text-footer-foreground border-t border-border/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-footer-foreground/60 text-center sm:text-left">
          <p>© ২০২৬ MarryLife.com সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1.5">
            <i className="ri-checkbox-circle-fill text-emerald-400 text-sm" /> সম্পূর্ণ শরীয়াহ
            নীতিমালা মোতাবেক পরিচালিত
          </p>
        </div>
      </footer>
    </div>
  );
}
