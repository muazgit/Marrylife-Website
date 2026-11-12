import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { toBengaliNumber } from "@/lib/utils/bengali";
import { logoutAction } from "@/lib/actions/auth";

export const metadata = {
  title: "ব্যবহারকারী ড্যাশবোর্ড | MarryLife",
  description: "আপনার MarryLife প্রোফাইল, বায়োডাটা স্ট্যাটাস এবং ক্রেডিট পরিচালনা করুন।",
};

const BIODATA_STATUS_LABELS: Record<string, { label: string; badgeClass: string; icon: string }> = {
  approved: {
    label: "অনুমোদিত",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "ri-checkbox-circle-fill",
  },
  pending_approval: {
    label: "যাচাইকরণাধীন",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "ri-time-line",
  },
  draft: {
    label: "খসড়া",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
    icon: "ri-file-line",
  },
  rejected: {
    label: "সংশোধন প্রয়োজন",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: "ri-close-circle-line",
  },
  hidden: {
    label: "লুকানো",
    badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
    icon: "ri-eye-off-line",
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Fetch user's biodata
  const { data: userBiodatas } = await supabase
    .from("biodatas")
    .select(
      "id, biodata_number, gender, status, rejection_reason, created_at, approved_at, highest_degree, occupation, permanent_district, permanent_division",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const primaryBiodata = userBiodatas?.[0] || null;
  const credits = profile?.credits ?? 5;
  const fullName = profile?.full_name || user.user_metadata?.full_name || "সম্মানিত ব্যবহারকারী";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Top Welcome Banner */}
      <section className="bg-lavender border-b border-border/40 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                ড্যাশবোর্ড
              </span>
              {profile?.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <i className="ri-verified-badge-fill text-xs" /> ভেরিফায়েড প্রোফাইল
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand">
              আসসালামু আলাইকুম, <span className="text-brand-pink">{fullName}</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              ইমেইল: <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </div>

          {/* Logout Action */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted hover:text-rose-600 transition-colors shadow-2xs cursor-pointer"
            >
              <i className="ri-logout-box-r-line" />
              <span>লগআউট</span>
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-7">
          {/* Stats & Credit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* Credits Card */}
            <div className="rounded-xl border border-gray-100 bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">
                  অবশিষ্ট যোগাযোগের ক্রেডিট
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand">
                  {toBengaliNumber(credits)}{" "}
                  <span className="text-sm font-normal text-muted-foreground">টি</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  অভিভাবকের নম্বর দেখার জন্য ব্যবহৃত হয়
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <i className="ri-coins-line text-2xl" />
              </div>
            </div>

            {/* Biodata Status Card */}
            <div className="rounded-xl border border-gray-100 bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">
                  বায়োডাটার অবস্থা
                </span>
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  {primaryBiodata
                    ? BIODATA_STATUS_LABELS[primaryBiodata.status]?.label || primaryBiodata.status
                    : "তৈরি করা হয়নি"}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {primaryBiodata
                    ? `নং: ML-${toBengaliNumber(primaryBiodata.biodata_number)}`
                    : "বায়োডাটা যুক্ত করুন"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0">
                <i className="ri-file-user-line text-2xl" />
              </div>
            </div>

            {/* Quick Browse Card */}
            <div className="rounded-xl border border-gray-100 bg-card p-5 sm:p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">
                  পাত্র-পাত্রী অনুসন্ধান
                </span>
                <div className="text-lg sm:text-xl font-bold text-brand">বায়োডাটা খুঁজুন</div>
                <Link
                  href="/biodatas"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-pink hover:underline mt-1"
                >
                  <span>সকল বায়োডাটা দেখুন</span>
                  <i className="ri-arrow-right-line" />
                </Link>
              </div>
              <div className="h-12 w-12 rounded-full bg-lavender-deep/30 text-brand flex items-center justify-center shrink-0">
                <i className="ri-search-eye-line text-2xl" />
              </div>
            </div>
          </div>

          {/* User's Biodata Management Section */}
          <div className="rounded-2xl border border-gray-100 bg-card p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/60">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                  <i className="ri-profile-line text-brand-pink" />
                  আমার বায়োডাটা
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  আপনার ব্যক্তিগত ও পারিবারিক বায়োডাটার তথ্য ও বর্তমান অবস্থা
                </p>
              </div>

              {primaryBiodata && (
                <Link
                  href="/biodata/create"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  <i className="ri-edit-line" /> বায়োডাটা সম্পাদনা করুন
                </Link>
              )}
            </div>

            <div className="pt-6">
              {primaryBiodata ? (
                /* When user HAS a biodata */
                <div className="rounded-xl border border-border/60 bg-muted/20 p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-sm">
                        ML-{toBengaliNumber(primaryBiodata.biodata_number)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-foreground">
                            {primaryBiodata.gender === "groom"
                              ? "পাত্রের বায়োডাটা"
                              : "পাত্রীর বায়োডাটা"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                              BIODATA_STATUS_LABELS[primaryBiodata.status]?.badgeClass ||
                              "bg-muted text-foreground"
                            }`}
                          >
                            <i
                              className={`${
                                BIODATA_STATUS_LABELS[primaryBiodata.status]?.icon ||
                                "ri-checkbox-blank-circle-fill"
                              } text-xs`}
                            />
                            {BIODATA_STATUS_LABELS[primaryBiodata.status]?.label ||
                              primaryBiodata.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {primaryBiodata.occupation} · {primaryBiodata.permanent_district},{" "}
                          {primaryBiodata.permanent_division}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/biodata/${primaryBiodata.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all"
                      >
                        <i className="ri-eye-line" /> বিস্তারিত প্রিভিউ দেখুন
                      </Link>
                    </div>
                  </div>

                  {/* Rejection / Moderation Notice if any */}
                  {primaryBiodata.status === "rejected" && primaryBiodata.rejection_reason && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
                      <i className="ri-alert-line text-rose-600 text-base shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold mb-1">সংশোধনের কারণ:</div>
                        <p>{primaryBiodata.rejection_reason}</p>
                      </div>
                    </div>
                  )}

                  {primaryBiodata.status === "pending_approval" && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-800 flex items-start gap-2.5">
                      <i className="ri-information-line text-amber-600 text-base shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">যাচাইকরণ প্রক্রিয়া চলছে:</span> আমাদের মডারেশন
                        টিম আপনার বায়োডাটা ও অভিভাবকের তথ্য যাচাই করছেন। অনুমোদন সম্পন্ন হলে এটি
                        পাবলিক তালিকায় প্রদর্শিত হবে।
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* When user DOES NOT HAVE a biodata */
                <div className="text-center py-8 sm:py-12 px-4 rounded-xl border border-dashed border-border/80 bg-lavender/30">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <i className="ri-file-add-line text-3xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                    আপনার কোনো বায়োডাটা তৈরি করা নেই
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-5 leading-relaxed">
                    MarryLife-এ দ্বীনদার জীবনসঙ্গী খুঁজতে এবং পাত্র-পাত্রীদের সাথে প্রস্তাব
                    আদান-প্রদান করতে সম্পূর্ণ বিনামূল্যে আপনার বায়োডাটা তৈরি করুন।
                  </p>
                  <Link
                    href="/biodata/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-xs sm:text-sm font-bold text-brand-foreground shadow-sm hover:bg-brand/90 transition-all active:scale-95"
                  >
                    <i className="ri-add-circle-line text-base" />
                    <span>বিনামূল্যে বায়োডাটা তৈরি করুন</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
