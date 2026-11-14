"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS_BY_DIVISION,
  BLOOD_GROUPS,
  COMPLEXIONS,
  EDUCATION_MEDIUMS,
  FINANCIAL_STATUSES,
  PRAYER_FREQUENCIES,
  RELIGIOUS_SECTS,
  GUARDIAN_RELATIONS,
  type BangladeshDivision,
} from "@/lib/constants/bangladesh";
import {
  saveBiodataAction,
  type BiodataPayload,
  type GenderType,
  type MaritalStatusType,
} from "@/lib/actions/biodata";
import { toBengaliNumber } from "@/lib/utils/bengali";
import type { Database } from "@/types/database.types";

type BiodataRow = Database["public"]["Tables"]["biodatas"]["Row"];
type ContactRow = Database["public"]["Tables"]["biodata_contacts"]["Row"];

export type InitialBiodataData = Partial<BiodataRow>;
export type InitialContactData = Partial<ContactRow>;

interface BiodataFormProps {
  initialBiodata?: InitialBiodataData | null | undefined;
  initialContact?: InitialContactData | null | undefined;
  userEmail?: string | undefined;
}

const STEPS = [
  { id: 1, title: "সাধারণ তথ্য", icon: "ri-user-line" },
  { id: 2, title: "ঠিকানা", icon: "ri-map-pin-line" },
  { id: 3, title: "শিক্ষা ও পেশা", icon: "ri-book-read-line" },
  { id: 4, title: "দ্বীনি অনুশীলন", icon: "ri-shield-star-line" },
  { id: 5, title: "পারিবারিক তথ্য", icon: "ri-home-heart-line" },
  { id: 6, title: "প্রত্যাশিত সঙ্গী", icon: "ri-heart-line" },
  { id: 7, title: "অভিভাবক ও যোগাযোগ", icon: "ri-lock-line" },
];

export function BiodataWizardForm({
  initialBiodata,
  initialContact,
  userEmail = "",
}: BiodataFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [stepError, setStepError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    biodataId: string;
    biodataNumber: number;
    message: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState<BiodataPayload>({
    // Step 1: General Info
    gender: (initialBiodata?.gender as GenderType) || "groom",
    marital_status: (initialBiodata?.marital_status as MaritalStatusType) || "never_married",
    birth_year: initialBiodata?.birth_year || 1998,
    height_feet: initialBiodata?.height_feet ?? 5,
    height_inches: initialBiodata?.height_inches ?? 6,
    weight_kg: initialBiodata?.weight_kg ?? 65,
    complexion: initialBiodata?.complexion || "উজ্জ্বল শ্যামলা",
    blood_group: initialBiodata?.blood_group || "B+",

    // Step 2: Location
    division: initialBiodata?.division || "ঢাকা",
    district: initialBiodata?.district || "ঢাকা",
    upazila: initialBiodata?.upazila || "",
    permanent_division: initialBiodata?.permanent_division || "ঢাকা",
    permanent_district: initialBiodata?.permanent_district || "ঢাকা",
    permanent_upazila: initialBiodata?.permanent_upazila || "",

    // Step 3: Education & Career
    education_medium: initialBiodata?.education_medium || "সাধারণ (General)",
    highest_degree: initialBiodata?.highest_degree || "",
    occupation: initialBiodata?.occupation || "",
    monthly_income: initialBiodata?.monthly_income || "",

    // Step 4: Religious Practice
    prayer_frequency: initialBiodata?.prayer_frequency || "হ্যাঁ, নিয়মিত ৫ ওয়াক্ত",
    observes_purdah_or_beard: initialBiodata?.observes_purdah_or_beard ?? true,
    mahram_non_mahram_care: initialBiodata?.mahram_non_mahram_care ?? true,
    quran_recitation_ability:
      initialBiodata?.quran_recitation_ability || "সহীহ ও শুদ্ধভাবে তিলাওয়াত করতে পারি",
    religious_sect: initialBiodata?.religious_sect || "সুন্নি (হানাফি)",

    // Step 5: Family
    father_occupation: initialBiodata?.father_occupation || "",
    mother_occupation: initialBiodata?.mother_occupation || "গৃহিণী",
    brothers_count: initialBiodata?.brothers_count ?? 1,
    sisters_count: initialBiodata?.sisters_count ?? 1,
    financial_status: initialBiodata?.financial_status || "মধ্যবিত্ত",

    // Step 6: Expected Partner
    expected_partner_age_min: initialBiodata?.expected_partner_age_min ?? 20,
    expected_partner_age_max: initialBiodata?.expected_partner_age_max ?? 28,
    expected_partner_height_min: initialBiodata?.expected_partner_height_min || "৫ ফুট ২ ইঞ্চি",
    expected_partner_district: initialBiodata?.expected_partner_district || [],
    expected_partner_qualities:
      initialBiodata?.expected_partner_qualities ||
      "দ্বীনদার, পাঁচ ওয়াক্ত নামাজি এবং শরীয়াহসম্মত পর্দা ও মাহরাম বিধান মেনে চলা উপযুক্ত জীবনসঙ্গী প্রত্যাশা করছি।",

    // Step 7: Guardian & Contact
    candidate_name: initialContact?.candidate_name || "",
    candidate_phone: initialContact?.candidate_phone || "",
    guardian_name: initialContact?.guardian_name || "",
    guardian_relation: initialContact?.guardian_relation || "পিতা",
    guardian_phone: initialContact?.guardian_phone || "",
    guardian_agreement: initialContact?.guardian_agreement ?? true,
    email: initialContact?.email || userEmail || "",
    full_address: initialContact?.full_address || "",
  });

  const isEditing = Boolean(initialBiodata?.id);

  // Helper to update state
  const updateField = <K extends keyof BiodataPayload>(key: K, value: BiodataPayload[K]) => {
    setStepError(null);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Step Validation
  const validateCurrentStep = (step: number): boolean => {
    setStepError(null);

    if (step === 1) {
      if (!formData.birth_year || formData.birth_year < 1960 || formData.birth_year > 2010) {
        setStepError("অনুগ্রহ করে সঠিক জন্ম সাল নির্বাচন করুন।");
        return false;
      }
      if (!formData.complexion) {
        setStepError("অনুগ্রহ করে গায়ের রঙ নির্বাচন করুন।");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.division || !formData.district || !formData.upazila.trim()) {
        setStepError("অনুগ্রহ করে বর্তমান বিভাগ, জেলা এবং উপজেলা সম্পূর্ণ লিখুন।");
        return false;
      }
      if (!formData.permanent_division || !formData.permanent_district) {
        setStepError("অনুগ্রহ করে স্থায়ী বিভাগ এবং জেলা নির্বাচন করুন।");
        return false;
      }
    }

    if (step === 3) {
      if (!formData.education_medium) {
        setStepError("অনুগ্রহ করে শিক্ষা মাধ্যম নির্বাচন করুন।");
        return false;
      }
      if (!formData.highest_degree.trim()) {
        setStepError("অনুগ্রহ করে সর্বোচ্চ শিক্ষাগত যোগ্যতা উল্লেখ করুন।");
        return false;
      }
      if (!formData.occupation.trim()) {
        setStepError("অনুগ্রহ করে আপনার বর্তমান পেশা উল্লেখ করুন।");
        return false;
      }
    }

    if (step === 4) {
      if (!formData.prayer_frequency) {
        setStepError("অনুগ্রহ করে নামাজের বিবরণ প্রদান করুন।");
        return false;
      }
    }

    if (step === 5) {
      if (!formData.financial_status) {
        setStepError("অনুগ্রহ করে পারিবারিক অর্থনৈতিক অবস্থা নির্বাচন করুন।");
        return false;
      }
    }

    if (step === 6) {
      if (
        !formData.expected_partner_qualities ||
        formData.expected_partner_qualities.trim().length < 10
      ) {
        setStepError("প্রত্যাশিত জীবনসঙ্গীর বৈশিষ্ট্য কমপক্ষে ১০ অক্ষরে বিস্তারিত লিখুন।");
        return false;
      }
    }

    if (step === 7) {
      if (!formData.candidate_name.trim()) {
        setStepError("পাত্র/পাত্রীর পূর্ণ নাম উল্লেখ করুন।");
        return false;
      }
      if (!formData.guardian_name.trim()) {
        setStepError("অভিভাবকের নাম উল্লেখ করুন।");
        return false;
      }
      if (!formData.guardian_phone.trim() || formData.guardian_phone.trim().length < 11) {
        setStepError("অভিভাবকের সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।");
        return false;
      }
      if (!formData.guardian_agreement) {
        setStepError("বায়োডাটা জমা দেওয়ার পূর্বে অভিভাবকের সম্মতি থাকা বাধ্যতামূলক।");
        return false;
      }
      if (!formData.full_address.trim() || formData.full_address.trim().length < 6) {
        setStepError("অনুগ্রহ করে পূর্ণ যোগাযোগের ঠিকানা বিস্তারিত লিখুন।");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!validateCurrentStep(7)) return;

    startTransition(async () => {
      const res = await saveBiodataAction(formData);
      if (res.error) {
        setStepError(res.error);
      } else if (res.success && res.biodataId) {
        setSubmissionSuccess({
          biodataId: res.biodataId,
          biodataNumber: res.biodataNumber || 0,
          message: res.message || "বায়োডাটা সফলভাবে সংরক্ষিত হয়েছে।",
        });
      }
    });
  };

  // Districts for current and permanent
  const currentDistricts =
    BANGLADESH_DISTRICTS_BY_DIVISION[formData.division as BangladeshDivision] || [];
  const permanentDistricts =
    BANGLADESH_DISTRICTS_BY_DIVISION[formData.permanent_division as BangladeshDivision] || [];

  // If already submitted successfully
  if (submissionSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-card p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto my-8">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <i className="ri-checkbox-circle-fill text-5xl" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3 border border-emerald-200">
          <i className="ri-sparkling-fill" /> আবেদন গৃহীত হয়েছে
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-brand mb-2">
          আলহামদুলিল্লাহ! বায়োডাটা জমা সফল হয়েছে
        </h2>
        <div className="text-sm sm:text-base text-muted-foreground mb-4">
          আপনার বায়োডাটা নম্বর:{" "}
          <strong className="text-foreground font-black text-lg">
            ML-{toBengaliNumber(submissionSuccess.biodataNumber)}
          </strong>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
          আমাদের মডারেশন টিম আপনার বায়োডাটা ও অভিভাবকের তথ্য যাচাই করে অতি দ্রুত অনুমোদন করবেন।
          অনুমোদন সম্পন্ন হলে এটি পাবলিক তালিকায় দৃশ্যমান হবে।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer"
          >
            <i className="ri-dashboard-line" />
            <span>ড্যাশবোর্ডে ফিরে যান</span>
          </Link>
          <Link
            href={`/biodata/${submissionSuccess.biodataId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <i className="ri-eye-line" />
            <span>বায়োডাটা প্রিভিউ দেখুন</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editing Notice Banner */}
      {isEditing && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-800 flex items-center gap-3">
          <i className="ri-edit-line text-lg text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">বায়োডাটা সম্পাদনা মোড:</span> আপনি ইতিপূর্বে সংরক্ষিত
            বায়োডাটা সম্পাদনা করছেন। সংশোধন শেষে জমা দিলে এটি পুনরায় দ্রুত যাচাই করা হবে।
          </div>
        </div>
      )}

      {/* Step Progress Header */}
      <div className="rounded-xl border border-gray-100 bg-card p-4 sm:p-5 shadow-xs">
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-brand mb-2">
          <span>
            ধাপ {toBengaliNumber(currentStep)} / {toBengaliNumber(STEPS.length)}:{" "}
            {STEPS[currentStep - 1]?.title}
          </span>
          <span className="text-muted-foreground">
            {toBengaliNumber(Math.round((currentStep / STEPS.length) * 100))}% সম্পন্ন
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-pink to-brand transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step Icons (Desktop & Tablet) */}
        <div className="hidden md:grid grid-cols-7 gap-2 mt-4 pt-3 border-t border-border/50">
          {STEPS.map((s) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id < currentStep) setCurrentStep(s.id);
                }}
                className={`flex flex-col items-center text-center p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-brand/10 text-brand font-bold"
                    : isCompleted
                      ? "text-emerald-700 hover:bg-emerald-50"
                      : "text-muted-foreground/70 cursor-not-allowed"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center mb-1 text-sm ${
                    isCurrent
                      ? "bg-brand text-brand-foreground"
                      : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <i className="ri-check-line" /> : <i className={s.icon} />}
                </div>
                <span className="truncate w-full">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Error Banner */}
      {stepError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5 animate-shake">
          <i className="ri-error-warning-line text-lg text-rose-600 shrink-0 mt-0.5" />
          <div className="font-semibold">{stepError}</div>
        </div>
      )}

      {/* Step Content Card */}
      <div className="rounded-2xl border border-gray-100 bg-card p-5 sm:p-8 shadow-xs">
        {/* ================= STEP 1: সাধারণ তথ্য ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                <i className="ri-user-line text-brand-pink" /> সাধারণ তথ্য
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                আপনার মৌলিক ব্যক্তিগত তথ্য প্রদান করুন
              </p>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-2">
                বায়োডাটার ধরন <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => updateField("gender", "groom")}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    formData.gender === "groom"
                      ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/20"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <i className="ri-user-heart-line text-lg" />
                  <span>পাত্রের বায়োডাটা</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateField("gender", "bride")}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    formData.gender === "bride"
                      ? "border-brand-pink bg-brand-pink/5 text-brand-pink ring-2 ring-brand-pink/20"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <i className="ri-women-line text-lg" />
                  <span>পাত্রীর বায়োডাটা</span>
                </button>
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-2">
                বৈবাহিক অবস্থা <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { value: "never_married", label: "অবিবাহিত" },
                  { value: "divorced", label: "ডিভোর্সড" },
                  { value: "widowed", label: "বিধবা/বিপত্নীক" },
                  { value: "separated", label: "বিচ্ছিন্ন" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateField("marital_status", item.value as MaritalStatusType)}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center ${
                      formData.marital_status === item.value
                        ? "border-brand bg-brand/10 text-brand ring-1 ring-brand"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth Year, Height, Weight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Birth Year */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  জন্ম সাল <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.birth_year}
                  onChange={(e) => updateField("birth_year", Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
                >
                  {Array.from({ length: 45 }, (_, i) => 2008 - i).map((yr) => (
                    <option key={yr} value={yr}>
                      {toBengaliNumber(yr)} ({toBengaliNumber(new Date().getFullYear() - yr)} বছর)
                    </option>
                  ))}
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  উচ্চতা <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.height_feet}
                    onChange={(e) => updateField("height_feet", Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-card px-2.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                  >
                    {[4, 5, 6, 7].map((f) => (
                      <option key={f} value={f}>
                        {toBengaliNumber(f)} ফুট
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.height_inches}
                    onChange={(e) => updateField("height_inches", Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-card px-2.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                  >
                    {Array.from({ length: 12 }, (_, i) => i).map((inch) => (
                      <option key={inch} value={inch}>
                        {toBengaliNumber(inch)} ইঞ্চি
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  ওজন (কেজি)
                </label>
                <input
                  type="number"
                  min="35"
                  max="150"
                  value={formData.weight_kg ?? ""}
                  onChange={(e) =>
                    updateField("weight_kg", e.target.value ? Number(e.target.value) : null)
                  }
                  placeholder="যেমন: ৬৫"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            {/* Complexion & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  গায়ের রঙ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.complexion}
                  onChange={(e) => updateField("complexion", e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                >
                  {COMPLEXIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  রক্তের গ্রুপ
                </label>
                <select
                  value={formData.blood_group || ""}
                  onChange={(e) => updateField("blood_group", e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ঠিকানা ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                <i className="ri-map-pin-line text-brand-pink" /> ঠিকানার বিবরণ
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                আপনার বর্তমান এবং স্থায়ী ঠিকানার তথ্য প্রদান করুন
              </p>
            </div>

            {/* Present Address */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                <i className="ri-building-line text-brand" /> বর্তমান ঠিকানা
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    বিভাগ <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => {
                      const div = e.target.value;
                      const newDistricts =
                        BANGLADESH_DISTRICTS_BY_DIVISION[div as BangladeshDivision] || [];
                      setFormData((prev) => ({
                        ...prev,
                        division: div,
                        district: newDistricts[0] || "",
                      }));
                    }}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    জেলা <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    উপজেলা / থানা <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.upazila}
                    onChange={(e) => updateField("upazila", e.target.value)}
                    placeholder="যেমন: মিরপুর / সদর"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="space-y-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                  <i className="ri-home-4-line text-brand" /> স্থায়ী ঠিকানা
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      permanent_division: prev.division,
                      permanent_district: prev.district,
                      permanent_upazila: prev.upazila,
                    }));
                  }}
                  className="text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  বর্তমান ঠিকানার অনুরূপ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    স্থায়ী বিভাগ <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.permanent_division}
                    onChange={(e) => {
                      const div = e.target.value;
                      const newDistricts =
                        BANGLADESH_DISTRICTS_BY_DIVISION[div as BangladeshDivision] || [];
                      setFormData((prev) => ({
                        ...prev,
                        permanent_division: div,
                        permanent_district: newDistricts[0] || "",
                      }));
                    }}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    স্থায়ী জেলা <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.permanent_district}
                    onChange={(e) => updateField("permanent_district", e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                  >
                    {permanentDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">
                    স্থায়ী উপজেলা / থানা
                  </label>
                  <input
                    type="text"
                    value={formData.permanent_upazila || ""}
                    onChange={(e) => updateField("permanent_upazila", e.target.value)}
                    placeholder="যেমন: সদর"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: শিক্ষা ও পেশা ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                <i className="ri-book-read-line text-brand-pink" /> শিক্ষাগত যোগ্যতা ও পেশা
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                আপনার শিক্ষাগত পটভূমি ও বর্তমান কাজের বিবরণ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  শিক্ষা মাধ্যম <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.education_medium}
                  onChange={(e) => updateField("education_medium", e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                >
                  {EDUCATION_MEDIUMS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  সর্বোচ্চ শিক্ষাগত যোগ্যতা <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.highest_degree}
                  onChange={(e) => updateField("highest_degree", e.target.value)}
                  placeholder="যেমন: দাওরায়ে হাদিস / বিএসসি ইন সিএসই / কামিল"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  বর্তমান পেশা <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার / শিক্ষক / ব্যবসায়ী"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  মাসিক আয়
                </label>
                <input
                  type="text"
                  value={formData.monthly_income || ""}
                  onChange={(e) => updateField("monthly_income", e.target.value)}
                  placeholder="যেমন: ৫০,০০০ - ৬০,০০০ টাকা / প্রযোজ্য নয়"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: দ্বীনি অনুশীলন ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                <i className="ri-shield-star-line text-brand-pink" /> দ্বীনি কার্যাবলী ও অনুশীলন
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                ইসলামিক জীবনধারা ও দৈনন্দিন আমল সংক্রান্ত বিবরণ
              </p>
            </div>

            <div className="space-y-4">
              {/* Prayer Frequency */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  পাঁচ ওয়াক্ত নামাজ পড়েন কি? <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.prayer_frequency}
                  onChange={(e) => updateField("prayer_frequency", e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                >
                  {PRAYER_FREQUENCIES.map((pf) => (
                    <option key={pf} value={pf}>
                      {pf}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sunnah Beard / Purdah Toggle */}
              <div className="rounded-xl border border-border p-4 bg-muted/20">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.observes_purdah_or_beard}
                    onChange={(e) => updateField("observes_purdah_or_beard", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-input text-brand focus:ring-brand accent-brand cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-foreground block">
                      {formData.gender === "groom"
                        ? "সুন্নতি দাড়ি রয়েছে এবং তা সংরক্ষণ করেন"
                        : "শরীয়াহসম্মত পর্দা (নিকাব/হিজাব) নিয়মিত পালন করেন"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ইসলামিক শরিয়তের বিধান অনুসারে এটি অত্যন্ত গুরুত্বপূর্ণ পূর্বশর্ত।
                    </span>
                  </div>
                </label>
              </div>

              {/* Mahram Non-Mahram Observance */}
              <div className="rounded-xl border border-border p-4 bg-muted/20">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mahram_non_mahram_care}
                    onChange={(e) => updateField("mahram_non_mahram_care", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-input text-brand focus:ring-brand accent-brand cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-foreground block">
                      মাহরাম ও গায়রে-মাহরাম বিধান কঠোরভাবে মেনে চলেন
                    </span>
                    <span className="text-xs text-muted-foreground">
                      পারিবারিক ও কর্মক্ষেত্রে অনাত্মীয়দের সাথে পর্দা বজায় রাখেন।
                    </span>
                  </div>
                </label>
              </div>

              {/* Quran Recitation Ability */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  সহীহ ও শুদ্ধভাবে কুরআন তিলাওয়াত করতে পারেন কি?
                </label>
                <input
                  type="text"
                  value={formData.quran_recitation_ability || ""}
                  onChange={(e) => updateField("quran_recitation_ability", e.target.value)}
                  placeholder="যেমন: হ্যাঁ, সহীহ ও তাজবীদ সহকারে তিলাওয়াত করতে পারি"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              {/* Religious Sect / Fiqh */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  মাজহাব / মানহাজ
                </label>
                <select
                  value={formData.religious_sect || "সুন্নি (হানাফি)"}
                  onChange={(e) => updateField("religious_sect", e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                >
                  {RELIGIOUS_SECTS.map((sect) => (
                    <option key={sect} value={sect}>
                      {sect}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 5: পারিবারিক তথ্য ================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                <i className="ri-home-heart-line text-brand-pink" /> পারিবারিক বিবরণ
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                আপনার পিতা-মাতা, ভাই-বোন ও পারিবারিক অবস্থা সংক্রান্ত তথ্য
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  পিতার পেশা
                </label>
                <input
                  type="text"
                  value={formData.father_occupation || ""}
                  onChange={(e) => updateField("father_occupation", e.target.value)}
                  placeholder="যেমন: ব্যবসায়ী / অবসরপ্রাপ্ত সরকারি কর্মকর্তা / জীবিত নেই"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  মাতার পেশা
                </label>
                <input
                  type="text"
                  value={formData.mother_occupation || ""}
                  onChange={(e) => updateField("mother_occupation", e.target.value)}
                  placeholder="যেমন: গৃহিণী / শিক্ষিকা"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  ভাইয়ের সংখ্যা
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={formData.brothers_count ?? 0}
                  onChange={(e) => updateField("brothers_count", Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  বোনের সংখ্যা
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={formData.sisters_count ?? 0}
                  onChange={(e) => updateField("sisters_count", Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  পারিবারিক অর্থনৈতিক অবস্থা <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.financial_status || "মধ্যবিত্ত"}
                  onChange={(e) => updateField("financial_status", e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                >
                  {FINANCIAL_STATUSES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 6: প্রত্যাশিত জীবনসঙ্গী ================= */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                <i className="ri-heart-line text-brand-pink" /> প্রত্যাশিত জীবনসঙ্গীর বৈশিষ্ট্য
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                কেমন জীবনসঙ্গী খুঁজছেন তার সুস্পষ্ট বিবরণ দিন
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  প্রত্যাশিত সর্বনিম্ন বয়স
                </label>
                <input
                  type="number"
                  min="18"
                  max="60"
                  value={formData.expected_partner_age_min ?? 18}
                  onChange={(e) => updateField("expected_partner_age_min", Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  প্রত্যাশিত সর্বোচ্চ বয়স
                </label>
                <input
                  type="number"
                  min="18"
                  max="60"
                  value={formData.expected_partner_age_max ?? 35}
                  onChange={(e) => updateField("expected_partner_age_max", Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  প্রত্যাশিত ন্যূনতম উচ্চতা
                </label>
                <input
                  type="text"
                  value={formData.expected_partner_height_min || ""}
                  onChange={(e) => updateField("expected_partner_height_min", e.target.value)}
                  placeholder="যেমন: ৫ ফুট ২ ইঞ্চি"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  প্রত্যাশিত জীবনসঙ্গীর দ্বীনি ও সাধারণ গুণাবলী{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.expected_partner_qualities}
                  onChange={(e) => updateField("expected_partner_qualities", e.target.value)}
                  placeholder="যেমন: পাঁচ ওয়াক্ত নামাজি, পর্দাশীল, সৎ ও বিনয়ী হতে হবে..."
                  className="w-full rounded-lg border border-input bg-card p-3 text-xs sm:text-sm font-medium outline-none focus:border-brand leading-relaxed"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  কমপক্ষে ১০ অক্ষরে বিস্তারিতভাবে আপনার প্রত্যাশা তুলে ধরুন।
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 7: অভিভাবক ও যোগাযোগ (গোপনীয়) ================= */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
                <i className="ri-lock-line text-brand-pink" /> অভিভাবক ও গোপনীয় যোগাযোগের তথ্য
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                এই তথ্যগুলো সম্পূর্ণ সুরক্ষিত থাকবে এবং কখনোই উন্মুক্ত বায়োডাটা কার্ডে প্রকাশিত হবে
                না
              </p>
            </div>

            {/* Privacy Alert */}
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-xs sm:text-sm text-foreground flex items-start gap-3">
              <i className="ri-shield-check-fill text-xl text-brand shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-brand block mb-1">কঠোর শরীয়াহ গোপনীয়তা নিরাপত্তা:</strong>
                প্রার্থী ও অভিভাবকের ফোন নম্বর এবং সম্পূর্ণ ঠিকানা আমাদের ডাটাবেজে এনক্রিপ্টেড ও
                সুরক্ষিত রাখা হয়। উভয় পক্ষের পরিবারের পারস্পরিক প্রস্তাব গ্রহণের পরই শুধুমাত্র
                অনুমোদিত অভিভাবকের কাছে এই তথ্য দৃশ্যমান হয়।
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  পাত্র/পাত্রীর পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.candidate_name}
                  onChange={(e) => updateField("candidate_name", e.target.value)}
                  placeholder="যেমন: আব্দুল্লাহ আল মামুন / ফাতেমা আক্তার"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  পাত্র/পাত্রীর ব্যক্তিগত মোবাইল (ঐচ্ছিক)
                </label>
                <input
                  type="tel"
                  value={formData.candidate_phone || ""}
                  onChange={(e) => updateField("candidate_phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  অভিভাবকের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guardian_name}
                  onChange={(e) => updateField("guardian_name", e.target.value)}
                  placeholder="যেমন: মোহাম্মদ রফিকুল ইসলাম"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  অভিভাবকের সাথে সম্পর্ক <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.guardian_relation}
                  onChange={(e) => updateField("guardian_relation", e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand cursor-pointer"
                >
                  {GUARDIAN_RELATIONS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  অভিভাবকের মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.guardian_phone}
                  onChange={(e) => updateField("guardian_phone", e.target.value)}
                  placeholder="01XXXXXXXXX (১১ ডিজিট)"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  যোগাযোগের ইমেইল
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                  পূর্ণ যোগাযোগের ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.full_address}
                  onChange={(e) => updateField("full_address", e.target.value)}
                  placeholder="বাড়ি/গ্রাম, রোড/পাড়া, পোস্ট অফিস, উপজেলা, জেলা..."
                  className="w-full rounded-lg border border-input bg-card p-3 text-xs sm:text-sm font-medium outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 rounded-xl border border-border p-4 bg-muted/20">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.guardian_agreement}
                    onChange={(e) => updateField("guardian_agreement", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-input text-brand focus:ring-brand accent-brand cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-foreground block">
                      আমি অঙ্গীকার করছি যে আমার অভিভাবকের পূর্ণ অবগতি ও সম্মতি রয়েছে
                    </span>
                    <span className="text-xs text-muted-foreground">
                      প্রদত্ত সকল তথ্য সত্য ও নির্ভুল। কোনো অসত্য বা বিভ্রান্তিকর তথ্য দিলে
                      বায়োডাটা বাতিল হবে।
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= Navigation & Submission Bar ================= */}
        <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line" />
              <span>পূর্ববর্তী ধাপ</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-6 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer active:scale-95"
            >
              <span>পরবর্তী ধাপ</span>
              <i className="ri-arrow-right-line" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3 text-xs sm:text-sm font-bold text-brand-foreground shadow-md hover:bg-brand/90 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isPending ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-base" />
                  <span>সংরক্ষণ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <i className="ri-checkbox-circle-line text-base" />
                  <span>{isEditing ? "বায়োডাটা আপডেট করুন" : "বায়োডাটা জমা দিন"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
