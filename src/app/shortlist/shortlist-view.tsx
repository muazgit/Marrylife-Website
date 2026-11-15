"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BiodataCard,
  type BiodataCardSummary,
  SHORTLIST_STORAGE_KEY,
} from "@/components/biodata-card";
import {
  syncLocalShortlistAction,
  getShortlistedBiodatasAction,
  removeFromShortlistAction,
  clearAllShortlistsAction,
} from "@/lib/actions/shortlist";
import { toBengaliNumber } from "@/lib/utils/bengali";

interface ShortlistViewProps {
  initialBiodatas: BiodataCardSummary[];
  isLoggedIn: boolean;
}

export function ShortlistView({ initialBiodatas, isLoggedIn }: ShortlistViewProps) {
  const router = useRouter();
  const [biodatas, setBiodatas] = useState<BiodataCardSummary[]>(initialBiodatas);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
      const localIds: string[] = saved ? JSON.parse(saved) : [];

      if (isLoggedIn && localIds.length > 0) {
        // Sync local to database, then clear local copy to prevent duplicate/stale sync
        syncLocalShortlistAction(localIds).then((res) => {
          if (res.success) {
            try {
              window.localStorage.removeItem(SHORTLIST_STORAGE_KEY);
            } catch {
              // Ignore
            }
            router.refresh();
          }
        });
      } else if (!isLoggedIn && localIds.length > 0) {
        // Fetch cards for local IDs
        setLoading(true);
        getShortlistedBiodatasAction(localIds)
          .then((cards) => {
            setBiodatas(cards);
          })
          .finally(() => setLoading(false));
      }
    } catch {
      // Ignore
    }
  }, [isLoggedIn, router]);

  // Keep state in sync with server changes
  useEffect(() => {
    if (isLoggedIn) {
      setBiodatas(initialBiodatas);
    }
  }, [initialBiodatas, isLoggedIn]);

  const handleRemoveOne = async (biodataId: string) => {
    // Optimistic removal from UI
    setBiodatas((prev) => prev.filter((b) => b.id !== biodataId));

    // Remove from localStorage
    try {
      const saved = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const updated = ids.filter((id) => id !== biodataId);
        window.localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }

    // Remove from Supabase if logged in
    if (isLoggedIn) {
      const res = await removeFromShortlistAction(biodataId);
      if (!res.success) {
        // If error, refresh to get true state
        router.refresh();
      } else {
        router.refresh();
      }
    }
  };

  const handleClearAll = async () => {
    if (!confirm("আপনি কি নিশ্চিতভাবে শর্টলিস্টের সকল বায়োডাটা মুছে ফেলতে চান?")) return;

    // Optimistically clear local state
    setBiodatas([]);

    // Clear localStorage
    try {
      window.localStorage.removeItem(SHORTLIST_STORAGE_KEY);
    } catch {
      // Ignore
    }

    // Clear Supabase DB
    if (isLoggedIn) {
      await clearAllShortlistsAction();
    }

    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Guest Notice Banner */}
      {!isLoggedIn && (
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-xs sm:text-sm text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <i className="ri-information-line text-lg text-brand shrink-0" />
            <span>
              <strong>লগইন করে শর্টলিস্ট সংরক্ষণ করুন:</strong> আপনি বর্তমানে অতিথি হিসেবে দেখছেন।
              লগইন করলে আপনার পছন্দের বায়োডাটা যেকোনো ডিভাইস থেকে সংরক্ষিত থাকবে।
            </span>
          </div>
          <Link
            href="/login?next=/shortlist"
            className="inline-flex items-center justify-center shrink-0 rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-brand-foreground hover:bg-brand/90 transition-all"
          >
            লগইন করুন
          </Link>
        </div>
      )}

      {/* Top Counter & Clear Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs sm:text-sm">
        <span className="font-bold text-foreground">
          মোট সংরক্ষিত:{" "}
          <span className="text-brand font-black">{toBengaliNumber(biodatas.length)}</span> টি
          বায়োডাটা
        </span>

        {biodatas.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
          >
            <i className="ri-delete-bin-line" />
            <span>তালিকা খালি করুন</span>
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground">
          <i className="ri-loader-4-line animate-spin text-2xl text-brand block mb-2" />
          <span>শর্টলিস্ট লোড হচ্ছে...</span>
        </div>
      ) : biodatas.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-lavender/30 max-w-lg mx-auto space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
            <i className="ri-heart-line text-3xl" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
              আপনার শর্টলিস্ট বর্তমানে খালি
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              বায়োডাটা অনুসন্ধান করার সময় পছন্দনীয় পাত্র বা পাত্রীর কার্ডের হার্ট (❤️) আইকনে
              ক্লিক করে সংরক্ষণ করুন।
            </p>
          </div>
          <Link
            href="/biodatas"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer active:scale-95"
          >
            <i className="ri-search-eye-line text-base" />
            <span>বায়োডাটা খুঁজুন</span>
          </Link>
        </div>
      ) : (
        /* Biodata Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {biodatas.map((bio) => (
            <div key={bio.id} className="flex flex-col">
              <BiodataCard
                biodata={bio}
                onToggleFavorite={(id, isFav) => {
                  if (!isFav) {
                    handleRemoveOne(id);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveOne(bio.id)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-rose-200/80 bg-rose-50/60 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-colors cursor-pointer"
                title="শর্টলিস্ট থেকে বাদ দিন"
              >
                <i className="ri-delete-bin-line text-xs" />
                <span>শর্টলিস্ট থেকে সরান</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
