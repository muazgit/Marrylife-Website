"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSearch() {
  const router = useRouter();
  const [gender, setGender] = useState("all");
  const [maritalStatus, setMaritalStatus] = useState("all");
  const [division, setDivision] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (gender !== "all") params.set("gender", gender);
    if (maritalStatus !== "all") params.set("marital_status", maritalStatus);
    if (division !== "all") params.set("division", division);

    router.push(`/biodatas?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-6 w-full max-w-4xl rounded-xl bg-card p-3.5 sm:p-5 shadow-xl shadow-brand/5 border border-gray-100 dark:border-border/60 transition-all text-start"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:items-end">
        {/* Looking For */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <i className="ri-user-search-line text-brand-pink" /> আমি খুঁজছি
          </label>
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full appearance-none rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium text-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
            >
              <option value="all">সবগুলো</option>
              <option value="groom">পাত্রের বায়োডাটা</option>
              <option value="bride">পাত্রীর বায়োডাটা</option>
            </select>
            <i className="ri-arrow-down-s-line pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-lg" />
          </div>
        </div>

        {/* Marital Status */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <i className="ri-heart-2-line text-brand-pink" /> বৈবাহিক অবস্থা
          </label>
          <div className="relative">
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              className="w-full appearance-none rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium text-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
            >
              <option value="all">সবগুলো</option>
              <option value="never_married">অবিবাহিত</option>
              <option value="divorced">ডিভোর্সড</option>
              <option value="widowed">বিধবা</option>
              <option value="separated">বিপত্নীক</option>
            </select>
            <i className="ri-arrow-down-s-line pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-lg" />
          </div>
        </div>

        {/* Permanent Address */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <i className="ri-map-pin-2-line text-brand-pink" /> স্থায়ী ঠিকানা
          </label>
          <div className="relative">
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full appearance-none rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium text-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
            >
              <option value="all">দেশ / বিভাগ নির্বাচন করুন</option>
              <option value="ঢাকা">ঢাকা বিভাগ</option>
              <option value="চট্টগ্রাম">চট্টগ্রাম বিভাগ</option>
              <option value="রাজশাহী">রাজশাহী বিভাগ</option>
              <option value="খুলনা">খুলনা বিভাগ</option>
              <option value="বরিশাল">বরিশাল বিভাগ</option>
              <option value="সিলেট">সিলেট বিভাগ</option>
              <option value="রংপুর">রংপুর বিভাগ</option>
              <option value="ময়মনসিংহ">ময়মনসিংহ বিভাগ</option>
            </select>
            <i className="ri-arrow-down-s-line pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-lg" />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-sm transition-all hover:bg-brand/90 hover:shadow active:scale-95 cursor-pointer"
          >
            <i className="ri-search-2-line text-base" /> বায়োডাটা খুঁজুন
          </button>
        </div>
      </div>
    </form>
  );
}
