import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { type BiodataCardSummary } from "@/components/biodata-card";
import { ShortlistView } from "./shortlist-view";

export const metadata = {
  title: "পছন্দের তালিকা (শর্টলিস্ট) | MarryLife",
  description: "আপনার পছন্দের পাত্র ও পাত্রীদের সংরক্ষিত শর্টলিস্ট দেখুন ও পরিচালনা করুন।",
};

interface ShortlistRow {
  biodata_id: string;
  biodata:
    (BiodataCardSummary & { status: string }) | (BiodataCardSummary & { status: string })[] | null;
}

export default async function ShortlistPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialBiodatas: BiodataCardSummary[] = [];

  if (user) {
    const { data: rows } = await supabase
      .from("shortlists")
      .select(
        `
        biodata_id,
        biodata:biodatas!biodata_id(
          id,
          biodata_number,
          gender,
          marital_status,
          birth_year,
          height_feet,
          height_inches,
          occupation,
          highest_degree,
          permanent_district,
          permanent_division,
          status
        )
      `,
      )
      .eq("user_id", user.id);

    const typedRows = (rows as unknown as ShortlistRow[]) || [];
    initialBiodatas = typedRows
      .map((r) => (Array.isArray(r.biodata) ? (r.biodata[0] ?? null) : r.biodata))
      .filter(
        (b): b is BiodataCardSummary & { status: string } => b !== null && b.status === "approved",
      );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-lavender border-b border-border/40 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-3 py-0.5 text-xs font-bold text-rose-700">
              <i className="ri-heart-fill text-xs" /> পছন্দের তালিকা
            </span>
            <span className="text-xs text-muted-foreground">সংরক্ষিত পাত্র-পাত্রী</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-brand">
            শর্টলিস্টকৃত বায়োডাটা সমূহ
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            আপনার পছন্দের পাত্র-পাত্রীদের সংরক্ষিত তালিকা। এখান থেকে সরাসরি বিস্তারিত দেখুন বা
            অভিভাবকের সাথে যোগাযোগের অনুরোধ পাঠান।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ShortlistView initialBiodatas={initialBiodatas} isLoggedIn={Boolean(user)} />
        </div>
      </main>
    </div>
  );
}
