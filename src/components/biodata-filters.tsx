"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

/* ---------- Constants ---------- */

const DIVISIONS = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
];

const MARITAL_STATUSES = [
  { value: "never_married", label: "অবিবাহিত" },
  { value: "divorced", label: "ডিভোর্সড" },
  { value: "widowed", label: "বিধবা/বিপত্নীক" },
  { value: "separated", label: "বিচ্ছিন্ন" },
];

/* ---------- FilterSelect helper ---------- */

function FilterSelect({
  icon,
  label,
  value,
  onChange,
  children,
}: {
  icon: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-foreground">
        <i className={`${icon} text-brand-pink text-sm`} /> {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-input bg-card px-3 py-2.5 text-xs sm:text-sm font-medium text-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
        >
          {children}
        </select>
        <i className="ri-arrow-down-s-line pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-lg" />
      </div>
    </div>
  );
}

/* ---------- Main Filters Component ---------- */

export function BiodataFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read current filter values from URL
  const gender = searchParams.get("gender") || "all";
  const maritalStatus = searchParams.get("marital_status") || "all";
  const division = searchParams.get("division") || "all";

  // Update URL with new filter params
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 when filters change
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  const hasFilters = gender !== "all" || maritalStatus !== "all" || division !== "all";

  const filterContent = (
    <div className="space-y-4">
      {/* Gender */}
      <FilterSelect
        icon="ri-user-search-line"
        label="বায়োডাটার ধরন"
        value={gender}
        onChange={(v) => updateFilter("gender", v)}
      >
        <option value="all">সবগুলো</option>
        <option value="groom">পাত্রের বায়োডাটা</option>
        <option value="bride">পাত্রীর বায়োডাটা</option>
      </FilterSelect>

      {/* Marital Status */}
      <FilterSelect
        icon="ri-heart-2-line"
        label="বৈবাহিক অবস্থা"
        value={maritalStatus}
        onChange={(v) => updateFilter("marital_status", v)}
      >
        <option value="all">সবগুলো</option>
        {MARITAL_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </FilterSelect>

      {/* Division */}
      <FilterSelect
        icon="ri-map-pin-2-line"
        label="স্থায়ী ঠিকানা (বিভাগ)"
        value={division}
        onChange={(v) => updateFilter("division", v)}
      >
        <option value="all">সকল বিভাগ</option>
        {DIVISIONS.map((d) => (
          <option key={d} value={d}>
            {d} বিভাগ
          </option>
        ))}
      </FilterSelect>

      {/* Clear button */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <i className="ri-filter-off-line text-sm" />
          সকল ফিল্টার মুছুন
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
        >
          <i className="ri-filter-3-line text-brand text-lg" />
          ফিল্টার করুন
          {hasFilters && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-brand-foreground text-[10px] font-bold">
              {
                [gender !== "all", maritalStatus !== "all", division !== "all"].filter(Boolean)
                  .length
              }
            </span>
          )}
          <i
            className={`ri-arrow-${mobileOpen ? "up" : "down"}-s-line text-muted-foreground text-lg ml-auto`}
          />
        </button>

        {/* Mobile filter drawer */}
        {mobileOpen && (
          <div className="mt-3 rounded-xl border border-gray-100 dark:border-border/60 bg-card p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-gray-100 dark:border-border/60 bg-card p-5 shadow-xs">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
            <i className="ri-filter-3-line text-brand text-lg" />
            ফিল্টার করুন
          </h3>
          {filterContent}
        </div>
      </aside>

      {/* Pending overlay indicator */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 pointer-events-none">
          <div className="flex items-center gap-2 rounded-lg bg-card px-4 py-2.5 shadow-lg border border-border">
            <i className="ri-loader-4-line animate-spin text-brand text-lg" />
            <span className="text-sm font-medium text-foreground">খোঁজা হচ্ছে...</span>
          </div>
        </div>
      )}
    </>
  );
}
