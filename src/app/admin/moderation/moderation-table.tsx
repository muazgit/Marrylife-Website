"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { approveBiodataAction, rejectBiodataAction } from "@/lib/actions/moderation";
import { toBengaliNumber, getAge, formatHeight } from "@/lib/utils/bengali";

export interface PendingBiodataItem {
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
  contact?: {
    candidate_name: string;
    candidate_phone?: string | null;
    guardian_name: string;
    guardian_relation: string;
    guardian_phone: string;
    full_address: string;
  } | null;
}

interface ModerationTableProps {
  biodatas: PendingBiodataItem[];
}

export function ModerationTable({ biodatas }: ModerationTableProps) {
  const router = useRouter();
  const [items, setItems] = useState<PendingBiodataItem[]>(biodatas);
  const [selectedBio, setSelectedBio] = useState<PendingBiodataItem | null>(null);
  const [rejectingBioId, setRejectingBioId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleApprove = (bioId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই বায়োডাটাটি অনুমোদন করতে চান?")) return;
    setFeedbackMsg(null);

    startTransition(async () => {
      const res = await approveBiodataAction(bioId);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== bioId));
        setFeedbackMsg({ type: "success", text: res.message || "বায়োডাটা অনুমোদিত হয়েছে।" });
        if (selectedBio?.id === bioId) setSelectedBio(null);
        router.refresh();
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "অনুমোদনে সমস্যা হয়েছে।" });
      }
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingBioId || !rejectReason.trim()) return;
    setFeedbackMsg(null);

    startTransition(async () => {
      const res = await rejectBiodataAction(rejectingBioId, rejectReason);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== rejectingBioId));
        setFeedbackMsg({ type: "success", text: res.message || "বায়োডাটা ফেরত পাঠানো হয়েছে।" });
        setRejectingBioId(null);
        setRejectReason("");
        if (selectedBio?.id === rejectingBioId) setSelectedBio(null);
        router.refresh();
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "প্রত্যাখ্যানে সমস্যা হয়েছে।" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {feedbackMsg && (
        <div
          className={`rounded-xl p-4 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <i
              className={
                feedbackMsg.type === "success"
                  ? "ri-checkbox-circle-fill text-emerald-600 text-lg"
                  : "ri-error-warning-fill text-rose-600 text-lg"
              }
            />
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-lavender/30 py-16 px-4 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <i className="ri-checkbox-circle-line text-3xl" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            বর্তমানে কোনো যাচাইকরণ অপেক্ষমাণ নেই
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            আলহামদুলিল্লাহ! সকল জমা দেওয়া বায়োডাটা যাচাই সম্পন্ন হয়েছে। নতুন বায়োডাটা জমা হলে
            এখানে স্বয়ংক্রিয়ভাবে তালিকাভুক্ত হবে।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card shadow-xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 font-bold text-foreground">
                <th className="p-3.5 sm:p-4">বায়োডাটা নং</th>
                <th className="p-3.5 sm:p-4">প্রার্থী ও লিঙ্গ</th>
                <th className="p-3.5 sm:p-4">বয়স ও উচ্চতা</th>
                <th className="p-3.5 sm:p-4">পেশা ও শিক্ষা</th>
                <th className="p-3.5 sm:p-4">অভিভাবকের তথ্য</th>
                <th className="p-3.5 sm:p-4">ঠিকানা</th>
                <th className="p-3.5 sm:p-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map((bio) => {
                const age = getAge(bio.birth_year);
                const isGroom = bio.gender === "groom";
                const biodataCode = `ML-${toBengaliNumber(bio.biodata_number)}`;

                return (
                  <tr key={bio.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-black text-brand whitespace-nowrap">
                      {biodataCode}
                    </td>

                    <td className="p-3.5 sm:p-4 whitespace-nowrap">
                      <div className="font-bold text-foreground">
                        {bio.contact?.candidate_name || "নাম অপ্রকাশ্য"}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isGroom
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : "bg-pink-50 text-pink-700 border border-pink-200"
                        }`}
                      >
                        {isGroom ? "পাত্র" : "পাত্রী"}
                      </span>
                    </td>

                    <td className="p-3.5 sm:p-4 whitespace-nowrap">
                      <div>{toBengaliNumber(age)} বছর</div>
                      <div className="text-muted-foreground text-[11px]">
                        {formatHeight(bio.height_feet, bio.height_inches)}
                      </div>
                    </td>

                    <td className="p-3.5 sm:p-4">
                      <div className="font-semibold text-foreground truncate max-w-[140px]">
                        {bio.occupation}
                      </div>
                      <div className="text-muted-foreground text-[11px] truncate max-w-[140px]">
                        {bio.highest_degree}
                      </div>
                    </td>

                    <td className="p-3.5 sm:p-4">
                      {bio.contact ? (
                        <div>
                          <div className="font-semibold text-foreground">
                            {bio.contact.guardian_name} ({bio.contact.guardian_relation})
                          </div>
                          <a
                            href={`tel:${bio.contact.guardian_phone}`}
                            className="text-brand font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                          >
                            <i className="ri-phone-fill text-[10px]" />
                            {bio.contact.guardian_phone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">তথ্য নেই</span>
                      )}
                    </td>

                    <td className="p-3.5 sm:p-4 text-xs whitespace-nowrap">
                      {bio.permanent_district}, {bio.permanent_division}
                    </td>

                    <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedBio(bio)}
                          className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                          title="সম্পূর্ণ বিস্তারিত দেখুন"
                        >
                          <i className="ri-eye-line" /> দেখুন
                        </button>

                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleApprove(bio.id)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          অনুমোদন
                        </button>

                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            setRejectingBioId(bio.id);
                            setRejectReason("");
                          }}
                          className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 px-2.5 py-1 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          সংশোধন
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Full Details Modal */}
      {selectedBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border p-6 shadow-xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-brand">
                  বায়োডাটা ML-{toBengaliNumber(selectedBio.biodata_number)}
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  যাচাইকরণাধীন
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBio(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-muted/20 rounded-xl">
                <div>
                  <span className="text-muted-foreground block text-xs">প্রার্থীর পূর্ণ নাম:</span>
                  <span className="font-bold text-foreground">
                    {selectedBio.contact?.candidate_name || "উল্লেখ নেই"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">ব্যক্তিগত মোবাইল:</span>
                  <span className="font-semibold text-foreground">
                    {selectedBio.contact?.candidate_phone || "উল্লেখ নেই"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">অভিভাবকের নাম:</span>
                  <span className="font-bold text-foreground">
                    {selectedBio.contact?.guardian_name} ({selectedBio.contact?.guardian_relation})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">অভিভাবকের মোবাইল:</span>
                  <span className="font-bold text-brand">
                    {selectedBio.contact?.guardian_phone}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-muted/20 rounded-xl space-y-2">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    পূর্ণ যোগাযোগের ঠিকানা:
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedBio.contact?.full_address || "উল্লেখ নেই"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">দ্বীনি বৈশিষ্ট্য:</span>
                  <span className="font-medium text-foreground">
                    নামাজ: {selectedBio.prayer_frequency} · পর্দা/দাড়ি:{" "}
                    {selectedBio.observes_purdah_or_beard ? "হ্যাঁ" : "না"} · মাহরাম যত্ন:{" "}
                    {selectedBio.mahram_non_mahram_care ? "হ্যাঁ" : "না"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">প্রত্যাশিত গুণাবলী:</span>
                  <p className="font-medium text-foreground leading-relaxed">
                    {selectedBio.expected_partner_qualities}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setSelectedBio(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectingBioId(selectedBio.id);
                  setRejectReason("");
                }}
                className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 px-4 py-2 text-xs font-bold transition-all cursor-pointer"
              >
                সংশোধন প্রয়োজন
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedBio.id)}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                অনুমোদন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject / Feedback Modal */}
      {rejectingBioId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleRejectSubmit}
            className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4 animate-in fade-in-50 zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <i className="ri-error-warning-line text-rose-600" />
                সংশোধনের কারণ উল্লেখ করুন
              </h3>
              <button
                type="button"
                onClick={() => setRejectingBioId(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              বায়োডাটাটি কী কারণে সংশোধন করা প্রয়োজন তা লিখুন। এটি প্রার্থীর ড্যাশবোর্ডে প্রদর্শিত
              হবে যাতে তিনি সংশোধন করে আবার জমা দিতে পারেন।
            </p>

            <div>
              <textarea
                required
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="উদাহরণ: অভিভাবকের ফোন নম্বরে যোগাযোগ করা সম্ভব হয়নি। অনুগ্রহ করে একটি সচল ফোন নম্বর প্রদান করুন।"
                className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingBioId(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isPending || !rejectReason.trim()}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? "পাঠানো হচ্ছে..." : "সংশোধন পাঠান"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
