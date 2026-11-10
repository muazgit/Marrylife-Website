import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { toBengaliNumber, getAge, formatHeight } from "@/lib/utils/bengali";

const PUBLIC_BIODATA_DETAIL_COLUMNS =
  "id, biodata_number, gender, marital_status, birth_year, height_feet, height_inches, weight_kg, complexion, blood_group, prayer_frequency, observes_purdah_or_beard, mahram_non_mahram_care, quran_recitation_ability, religious_sect, education_medium, highest_degree, occupation, division, district, upazila, permanent_division, permanent_district, permanent_upazila, father_occupation, mother_occupation, brothers_count, sisters_count, financial_status, expected_partner_age_min, expected_partner_age_max, expected_partner_height_min, expected_partner_district, expected_partner_qualities" as const;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const GENDER_LABELS: Record<string, string> = {
  groom: "পাত্রের বায়োডাটা",
  bride: "পাত্রীর বায়োডাটা",
};

const MARITAL_STATUS_LABELS: Record<string, string> = {
  never_married: "অবিবাহিত",
  divorced: "ডিভোর্সড",
  widowed: "বিধবা/বিপত্নীক",
  separated: "বিচ্ছিন্ন",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-2.5 border-b border-gray-100 last:border-b-0 text-xs sm:text-sm">
      <span className="text-muted-foreground font-medium">{label}:</span>
      <span className="font-semibold text-foreground">{value || "উল্লেখ নেই"}</span>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-card p-5 sm:p-6 shadow-xs">
      <h2 className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-brand mb-4 pb-2.5 border-b border-border/60">
        <i className={`${icon} text-brand-pink text-lg`} />
        {title}
      </h2>
      <div className="divide-y divide-gray-100">{children}</div>
    </section>
  );
}

export default async function BiodataDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: biodata, error } = await supabase
    .from("biodatas")
    .select(PUBLIC_BIODATA_DETAIL_COLUMNS)
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !biodata) {
    notFound();
  }

  const isGroom = biodata.gender === "groom";
  const biodataCode = `ML-${toBengaliNumber(biodata.biodata_number)}`;
  const age = getAge(biodata.birth_year);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Breadcrumb bar */}
      <section className="bg-lavender border-b border-border/40 py-4 sm:py-5">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 flex items-center justify-between gap-2">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand transition-colors">
              <i className="ri-home-4-line text-sm" /> হোম
            </Link>
            <i className="ri-arrow-right-s-line text-sm" />
            <Link href="/biodatas" className="hover:text-brand transition-colors">
              বায়োডাটা সমূহ
            </Link>
            <i className="ri-arrow-right-s-line text-sm" />
            <span className="text-foreground font-semibold">{biodataCode}</span>
          </nav>

          <Link
            href="/biodatas"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-pink transition-colors"
          >
            <i className="ri-arrow-left-line" /> তালিকায় ফিরুন
          </Link>
        </div>
      </section>

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="lg:grid lg:grid-cols-[320px_1fr] lg:items-start lg:gap-7 space-y-6 lg:space-y-0">
            {/* Left summary sidebar */}
            <aside className="lg:sticky lg:top-24 rounded-xl border border-gray-100 bg-card p-5 sm:p-6 shadow-xs text-center">
              <div
                className={`mx-auto mb-3.5 flex h-24 w-24 items-center justify-center rounded-full border-2 p-1 ${
                  isGroom ? "border-sky-300/70 bg-sky-50" : "border-pink-300/70 bg-pink-50"
                }`}
              >
                <Image
                  src={isGroom ? "/brand/male.svg" : "/brand/female.svg"}
                  alt={isGroom ? "পাত্রের অবতার" : "পাত্রীর অবতার"}
                  width={92}
                  height={92}
                  className="h-full w-full object-contain"
                />
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold ${
                  isGroom ? "bg-sky-500/10 text-sky-700" : "bg-pink-500/10 text-pink-700"
                }`}
              >
                {GENDER_LABELS[biodata.gender] || biodata.gender}
              </span>

              <h1 className="mt-2 text-2xl font-extrabold text-brand">{biodataCode}</h1>

              <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-left text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">বয়স:</span>
                  <span className="font-semibold">{toBengaliNumber(age)} বছর</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">উচ্চতা:</span>
                  <span className="font-semibold">
                    {formatHeight(biodata.height_feet, biodata.height_inches)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">বৈবাহিক অবস্থা:</span>
                  <span className="font-semibold">
                    {MARITAL_STATUS_LABELS[biodata.marital_status] || biodata.marital_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">পেশা:</span>
                  <span className="font-semibold text-right">{biodata.occupation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">গাত্রবর্ণ:</span>
                  <span className="font-semibold">{biodata.complexion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">রক্তের গ্রুপ:</span>
                  <span className="font-semibold">{biodata.blood_group || "উল্লেখ নেই"}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all"
                >
                  <i className="ri-shield-user-line" />
                  অভিভাবকের যোগাযোগের অনুরোধ করুন
                </Link>
              </div>
            </aside>

            {/* Right detail sections */}
            <div className="space-y-5">
              <SectionCard icon="ri-map-pin-2-line" title="ঠিকানা">
                <InfoRow
                  label="স্থায়ী ঠিকানা"
                  value={`${biodata.permanent_upazila ? `${biodata.permanent_upazila}, ` : ""}${biodata.permanent_district}, ${biodata.permanent_division}`}
                />
                <InfoRow
                  label="বর্তমান ঠিকানা"
                  value={`${biodata.upazila}, ${biodata.district}, ${biodata.division}`}
                />
              </SectionCard>

              <SectionCard icon="ri-graduation-cap-line" title="শিক্ষাগত যোগ্যতা ও পেশা">
                <InfoRow label="শিক্ষার মাধ্যম" value={biodata.education_medium} />
                <InfoRow label="সর্বোচ্চ শিক্ষাগত যোগ্যতা" value={biodata.highest_degree} />
                <InfoRow label="পেশা" value={biodata.occupation} />
              </SectionCard>

              <SectionCard icon="ri-parent-line" title="পারিবারিক তথ্য">
                <InfoRow label="পিতার পেশা" value={biodata.father_occupation} />
                <InfoRow label="মাতার পেশা" value={biodata.mother_occupation} />
                <InfoRow
                  label="ভাইয়ের সংখ্যা"
                  value={`${toBengaliNumber(biodata.brothers_count ?? 0)} জন`}
                />
                <InfoRow
                  label="বোনের সংখ্যা"
                  value={`${toBengaliNumber(biodata.sisters_count ?? 0)} জন`}
                />
                <InfoRow label="পারিবারিক অর্থনৈতিক অবস্থা" value={biodata.financial_status} />
              </SectionCard>

              <SectionCard icon="ri-moon-clear-line" title="ব্যক্তিগত ও দ্বীনি তথ্য">
                <InfoRow label="পাঁচ ওয়াক্ত নামাজ পড়েন কি?" value={biodata.prayer_frequency} />
                <InfoRow
                  label={isGroom ? "সুন্নতি দাড়ি আছে কি?" : "শরীয়াহসম্মত পর্দা করেন কি?"}
                  value={biodata.observes_purdah_or_beard ? "হ্যাঁ, আলহামদুলিল্লাহ" : "চেষ্টাধীন"}
                />
                <InfoRow
                  label="মাহরাম ও নন-মাহরাম মেনে চলেন কি?"
                  value={biodata.mahram_non_mahram_care ? "হ্যাঁ" : "না"}
                />
                <InfoRow
                  label="শুদ্ধভাবে কুরআন তিলাওয়াত করতে পারেন?"
                  value={biodata.quran_recitation_ability}
                />
                <InfoRow label="আকিদা / মাযহাব" value={biodata.religious_sect} />
                {biodata.weight_kg && (
                  <InfoRow label="ওজন" value={`${toBengaliNumber(biodata.weight_kg)} কেজি`} />
                )}
              </SectionCard>

              <SectionCard icon="ri-heart-add-line" title="প্রত্যাশিত জীবনসঙ্গী">
                {biodata.expected_partner_age_min && biodata.expected_partner_age_max && (
                  <InfoRow
                    label="প্রত্যাশিত বয়স"
                    value={`${toBengaliNumber(biodata.expected_partner_age_min)} - ${toBengaliNumber(biodata.expected_partner_age_max)} বছর`}
                  />
                )}
                <InfoRow label="ন্যূনতম উচ্চতা" value={biodata.expected_partner_height_min} />
                <InfoRow
                  label="প্রত্যাশিত জেলা"
                  value={biodata.expected_partner_district?.join(", ") || "যেকোনো জেলা"}
                />
                <InfoRow label="প্রত্যাশিত গুণাবলী" value={biodata.expected_partner_qualities} />
              </SectionCard>

              {/* Guardian Contact Protection Notice */}
              <section className="rounded-xl border border-brand/20 bg-lavender p-5 sm:p-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <i className="ri-lock-password-line text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-brand">
                      অভিভাবকের যোগাযোগের তথ্য সুরক্ষিত
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      শরীয়াহ নীতিমালা ও ব্যক্তিগত গোপনীয়তা রক্ষার স্বার্থে পাত্র-পাত্রী এবং
                      অভিভাবকের নাম ও মোবাইল নম্বর সরাসরি উন্মুক্ত রাখা হয়নি। অভিভাবকের অনুমতিক্রমে
                      যোগাযোগের তথ্য পেতে লগইন করে প্রস্তাব পাঠান।
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
