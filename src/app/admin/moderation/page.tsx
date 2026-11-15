import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Navbar } from "@/components/navbar";
import { toBengaliNumber } from "@/lib/utils/bengali";
import { ModerationTable, type PendingBiodataItem } from "./moderation-table";

export const metadata = {
  title: "মডারেশন প্যানেল | MarryLife Admin",
  description: "বায়োডাটা যাচাইকরণ, অনুমোদন ও অভিভাবকের তথ্য নিরীক্ষণ প্যানেল।",
};

interface ContactRow {
  candidate_name: string;
  candidate_phone: string | null;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  full_address: string;
}

interface RawPendingRow {
  id: string;
  biodata_number: number;
  gender: string;
  marital_status: string;
  birth_year: number;
  height_feet: number;
  height_inches: number;
  occupation: string;
  highest_degree: string;
  education_medium: string;
  permanent_district: string;
  permanent_division: string;
  prayer_frequency: string;
  observes_purdah_or_beard: boolean;
  mahram_non_mahram_care: boolean;
  expected_partner_qualities: string;
  created_at: string;
  contact: ContactRow | ContactRow[] | null;
}

function extractContact(raw: ContactRow | ContactRow[] | null): ContactRow | null {
  if (!raw) return null;
  return Array.isArray(raw) ? (raw[0] ?? null) : raw;
}

export default async function AdminModerationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/moderation");
  }

  // Verify staff role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
    redirect("/dashboard");
  }

  const adminClient = createAdminClient();

  // Fetch counts
  const [pendingCountRes, approvedCountRes, rejectedCountRes] = await Promise.all([
    adminClient
      .from("biodatas")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_approval"),
    adminClient
      .from("biodatas")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    adminClient
      .from("biodatas")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected"),
  ]);

  // Fetch pending list
  const { data: rawRows } = await adminClient
    .from("biodatas")
    .select(
      `
      id,
      biodata_number,
      gender,
      marital_status,
      birth_year,
      height_feet,
      height_inches,
      occupation,
      highest_degree,
      education_medium,
      permanent_district,
      permanent_division,
      prayer_frequency,
      observes_purdah_or_beard,
      mahram_non_mahram_care,
      expected_partner_qualities,
      created_at,
      contact:biodata_contacts(
        candidate_name,
        candidate_phone,
        guardian_name,
        guardian_relation,
        guardian_phone,
        full_address
      )
    `,
    )
    .eq("status", "pending_approval")
    .order("created_at", { ascending: true });

  const typedRows = (rawRows as unknown as RawPendingRow[]) || [];
  const pendingBiodatas: PendingBiodataItem[] = typedRows.map((r) => ({
    id: r.id,
    biodata_number: r.biodata_number,
    gender: r.gender,
    marital_status: r.marital_status,
    birth_year: r.birth_year,
    height_feet: r.height_feet,
    height_inches: r.height_inches,
    occupation: r.occupation,
    highest_degree: r.highest_degree,
    education_medium: r.education_medium,
    permanent_district: r.permanent_district,
    permanent_division: r.permanent_division,
    prayer_frequency: r.prayer_frequency,
    observes_purdah_or_beard: r.observes_purdah_or_beard,
    mahram_non_mahram_care: r.mahram_non_mahram_care,
    expected_partner_qualities: r.expected_partner_qualities,
    created_at: r.created_at,
    contact: extractContact(r.contact),
  }));

  const pendingCount = pendingCountRes.count ?? 0;
  const approvedCount = approvedCountRes.count ?? 0;
  const rejectedCount = rejectedCountRes.count ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-lavender border-b border-border/40 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/20 px-3 py-0.5 text-xs font-bold text-brand">
                  <i className="ri-shield-star-line text-xs" /> স্টাফ ও মডারেশন পোর্টাল
                </span>
                <span className="text-xs text-muted-foreground">
                  ভূমিকা: {profile.role === "admin" ? "অ্যাডমিন" : "মডারেটর"}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-brand">
                বায়োডাটা যাচাইকরণ ও অনুমোদন প্যানেল
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                জমা দেওয়া পাত্র-পাত্রীর তথ্য ও অভিভাবকের মোবাইল নম্বর যাচাই করে অনুমোদন বা সংশোধনের
                নির্দেশনা দিন।
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <i className="ri-arrow-left-line" />
              <span>ড্যাশবোর্ডে ফিরুন</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-7">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* Pending Counter */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-900 block mb-1">
                  যাচাইকরণ অপেক্ষমাণ
                </span>
                <div className="text-2xl font-extrabold text-amber-700">
                  {toBengaliNumber(pendingCount)}{" "}
                  <span className="text-sm font-normal text-amber-800/80">টি</span>
                </div>
                <p className="text-[11px] text-amber-800/80 mt-1">পর্যালোচনার অপেক্ষায় রয়েছে</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <i className="ri-time-line text-2xl" />
              </div>
            </div>

            {/* Approved Counter */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-900 block mb-1">
                  অনুমোদিত বায়োডাটা
                </span>
                <div className="text-2xl font-extrabold text-emerald-700">
                  {toBengaliNumber(approvedCount)}{" "}
                  <span className="text-sm font-normal text-emerald-800/80">টি</span>
                </div>
                <p className="text-[11px] text-emerald-800/80 mt-1">পাবলিক তালিকায় দৃশ্যমান</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <i className="ri-checkbox-circle-line text-2xl" />
              </div>
            </div>

            {/* Rejected Counter */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-900 block mb-1">
                  সংশোধন প্রয়োজন / বাতিল
                </span>
                <div className="text-2xl font-extrabold text-rose-700">
                  {toBengaliNumber(rejectedCount)}{" "}
                  <span className="text-sm font-normal text-rose-800/80">টি</span>
                </div>
                <p className="text-[11px] text-rose-800/80 mt-1">
                  ব্যবহারকারীকে সংশোধনের বার্তা পাঠানো
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <i className="ri-close-circle-line text-2xl" />
              </div>
            </div>
          </div>

          {/* Pending Moderation Table */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h2 className="text-base sm:text-lg font-extrabold text-brand flex items-center gap-2">
                <i className="ri-file-search-line text-brand-pink" />
                অপেক্ষমাণ বায়োডাটা সমূহ ({toBengaliNumber(pendingBiodatas.length)})
              </h2>
              <span className="text-xs text-muted-foreground">
                অভিভাবকের সাথে কথা বলে তথ্য নিশ্চিত করুন
              </span>
            </div>

            <ModerationTable biodatas={pendingBiodatas} />
          </div>
        </div>
      </main>
    </div>
  );
}
