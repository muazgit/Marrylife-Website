"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toBengaliNumber, getAge, formatHeight } from "@/lib/utils/bengali";
import type { Tables } from "@/types/database.types";

export const PUBLIC_BIODATA_CARD_COLUMNS =
  "id, biodata_number, gender, marital_status, birth_year, height_feet, height_inches, occupation, highest_degree, permanent_district, permanent_division" as const;

export type BiodataCardSummary = Pick<
  Tables<"biodatas">,
  | "id"
  | "biodata_number"
  | "gender"
  | "marital_status"
  | "birth_year"
  | "height_feet"
  | "height_inches"
  | "occupation"
  | "highest_degree"
  | "permanent_district"
  | "permanent_division"
>;

const SHORTLIST_STORAGE_KEY = "marrylife_shortlist";

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
  biodata: BiodataCardSummary;
}

export function BiodataCard({ biodata }: BiodataCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const age = getAge(biodata.birth_year);
  const biodataNumber = `ML-${toBengaliNumber(biodata.biodata_number)}`;
  const isGroom = biodata.gender === "groom";

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        setIsFavorite(ids.includes(biodata.id));
      }
    } catch {
      // Ignore storage errors
    }
  }, [biodata.id]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => {
      const next = !prev;
      try {
        const saved = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
        const ids: string[] = saved ? JSON.parse(saved) : [];
        const updated = next
          ? Array.from(new Set([...ids, biodata.id]))
          : ids.filter((id) => id !== biodata.id);
        window.localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  return (
    <Link
      href={`/biodata/${biodata.id}`}
      className="group block rounded-xl border border-gray-100 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand/30 overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        {/* Header row: avatar + gender badge / wishlist + biodata number */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <div
            className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full p-0.5 border-2 ${
              isGroom
                ? "border-sky-300/70 bg-sky-50 shadow-sky-100"
                : "border-pink-300/70 bg-pink-50 shadow-pink-100"
            } shadow-xs overflow-hidden flex items-center justify-center`}
          >
            <Image
              src={isGroom ? "/brand/male.svg" : "/brand/female.svg"}
              alt={isGroom ? "পাত্রের অবতার" : "পাত্রীর অবতার"}
              width={64}
              height={64}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              {/* Gender badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold ${
                  isGroom ? "bg-sky-500/10 text-sky-700" : "bg-pink-500/10 text-pink-700"
                }`}
              >
                <i className={`${isGroom ? "ri-user-star-line" : "ri-user-heart-line"} text-xs`} />
                {GENDER_LABELS[biodata.gender] || biodata.gender}
              </span>

              {/* Wishlist icon */}
              <span
                role="button"
                tabIndex={0}
                title={isFavorite ? "পছন্দের তালিকা থেকে বাদ দিন" : "পছন্দের তালিকায় যোগ করুন"}
                aria-label="Wishlist"
                aria-pressed={isFavorite}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite();
                  }
                }}
                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isFavorite
                    ? "text-rose-500 bg-rose-50 shadow-2xs"
                    : "text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-50"
                }`}
              >
                <i
                  className={`${
                    isFavorite ? "ri-heart-fill scale-110" : "ri-heart-line"
                  } text-base sm:text-lg transition-transform`}
                />
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-brand leading-tight">
              {biodataNumber}
            </h3>
          </div>
        </div>

        {/* Meta info list (1 vertical column) */}
        <div className="space-y-2 text-xs sm:text-[13px] border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <i className="ri-calendar-line text-brand/60" /> বয়স:
            </span>
            <span className="font-semibold text-foreground text-right">
              {toBengaliNumber(age)} বছর
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <i className="ri-ruler-line text-brand/60" /> উচ্চতা:
            </span>
            <span className="font-semibold text-foreground text-right">
              {formatHeight(biodata.height_feet, biodata.height_inches)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <i className="ri-heart-2-line text-brand/60" /> বৈবাহিক অবস্থা:
            </span>
            <span className="font-semibold text-foreground text-right">
              {MARITAL_STATUS_LABELS[biodata.marital_status] || biodata.marital_status}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <i className="ri-briefcase-line text-brand/60" /> পেশা:
            </span>
            <span className="font-semibold text-foreground text-right truncate max-w-[60%]">
              {biodata.occupation}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <i className="ri-graduation-cap-line text-brand/60" /> শিক্ষা:
            </span>
            <span className="font-semibold text-foreground text-right truncate max-w-[60%]">
              {biodata.highest_degree}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <i className="ri-map-pin-2-line text-brand/60" /> স্থায়ী ঠিকানা:
            </span>
            <span className="font-semibold text-foreground text-right truncate max-w-[60%]">
              {biodata.permanent_district}, {biodata.permanent_division}
            </span>
          </div>
        </div>

        {/* View button */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand/5 py-2 text-xs sm:text-sm font-bold text-brand transition-all">
            <span>বিস্তারিত দেখুন</span>
            <i className="ri-arrow-right-line text-sm group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
