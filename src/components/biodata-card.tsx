import Link from "next/link";
import Image from "next/image";
import { toBengaliNumber, getAge, formatHeight } from "@/lib/utils/bengali";
import type { Tables } from "@/types/database.types";

type Biodata = Tables<"biodatas">;

/* ---------- Label mappings ---------- */

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

/* ---------- Component ---------- */

interface BiodataCardProps {
  biodata: Biodata;
}

export function BiodataCard({ biodata }: BiodataCardProps) {
  const age = getAge(biodata.birth_year);
  const biodataNumber = `ML-${toBengaliNumber(biodata.biodata_number)}`;
  const isGroom = biodata.gender === "groom";

  return (
    <Link
      href={`/biodata/${biodata.id}`}
      className="group block rounded-xl border border-gray-100 dark:border-border/60 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand/30 overflow-hidden"
    >
      {/* Top color bar */}
      <div className={`h-1.5 w-full ${isGroom ? "bg-sky-500" : "bg-pink-500"}`} />

      <div className="p-4 sm:p-5">
        {/* Header row: avatar + biodata number + gender badge */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <div
            className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full p-0.5 border-2 ${
              isGroom
                ? "border-sky-300/70 bg-sky-50 shadow-sky-100"
                : "border-pink-300/70 bg-pink-50 shadow-pink-100"
            } shadow-xs overflow-hidden flex items-center justify-center`}
          >
            <Image
              src={isGroom ? "/brand/ml-groom.svg" : "/brand/ml-bride.svg"}
              alt={isGroom ? "পাত্রের অবতার" : "পাত্রীর অবতার"}
              width={64}
              height={64}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] sm:text-xs font-bold text-muted-foreground tracking-wide">
                বায়োডাটা নং
              </span>
              <span
                className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold ${
                  isGroom ? "bg-sky-500/10 text-sky-700" : "bg-pink-500/10 text-pink-700"
                }`}
              >
                <i className={`${isGroom ? "ri-user-star-line" : "ri-user-heart-line"} text-xs`} />
                {GENDER_LABELS[biodata.gender] || biodata.gender}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-brand leading-tight">
              {biodataNumber}
            </h3>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-[13px]">
          {/* Age */}
          <div className="flex items-center gap-1.5">
            <i className="ri-calendar-line text-brand/60 text-sm" />
            <span className="text-muted-foreground">বয়স:</span>
            <span className="font-semibold text-foreground">{toBengaliNumber(age)} বছর</span>
          </div>

          {/* Height */}
          <div className="flex items-center gap-1.5">
            <i className="ri-ruler-line text-brand/60 text-sm" />
            <span className="text-muted-foreground">উচ্চতা:</span>
            <span className="font-semibold text-foreground">
              {formatHeight(biodata.height_feet, biodata.height_inches)}
            </span>
          </div>

          {/* District */}
          <div className="flex items-center gap-1.5">
            <i className="ri-map-pin-2-line text-brand/60 text-sm" />
            <span className="text-muted-foreground">জেলা:</span>
            <span className="font-semibold text-foreground truncate">
              {biodata.permanent_district}
            </span>
          </div>

          {/* Education */}
          <div className="flex items-center gap-1.5">
            <i className="ri-graduation-cap-line text-brand/60 text-sm" />
            <span className="text-muted-foreground">শিক্ষা:</span>
            <span className="font-semibold text-foreground truncate">{biodata.highest_degree}</span>
          </div>

          {/* Occupation */}
          <div className="flex items-center gap-1.5">
            <i className="ri-briefcase-line text-brand/60 text-sm" />
            <span className="text-muted-foreground">পেশা:</span>
            <span className="font-semibold text-foreground truncate">{biodata.occupation}</span>
          </div>

          {/* Marital Status */}
          <div className="flex items-center gap-1.5">
            <i className="ri-heart-2-line text-brand/60 text-sm" />
            <span className="text-muted-foreground">অবস্থা:</span>
            <span className="font-semibold text-foreground">
              {MARITAL_STATUS_LABELS[biodata.marital_status] || biodata.marital_status}
            </span>
          </div>
        </div>

        {/* Deen badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {biodata.observes_purdah_or_beard && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold">
              <i className="ri-checkbox-circle-fill text-[10px]" />
              {isGroom ? "দাড়ি রাখেন" : "পর্দানশীন"}
            </span>
          )}
          {biodata.prayer_frequency === "five_times" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold">
              <i className="ri-checkbox-circle-fill text-[10px]" />
              পাঁচ ওয়াক্ত সালাত
            </span>
          )}
          {biodata.mahram_non_mahram_care && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold">
              <i className="ri-checkbox-circle-fill text-[10px]" />
              মাহরাম মেনে চলেন
            </span>
          )}
        </div>

        {/* View button */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-border/40">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand group-hover:text-brand-pink transition-colors">
            বিস্তারিত দেখুন
            <i className="ri-arrow-right-line text-sm group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
