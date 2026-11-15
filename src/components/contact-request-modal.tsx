"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendContactRequestAction } from "@/lib/actions/proposal";
import { toBengaliNumber } from "@/lib/utils/bengali";

export interface UnlockedContactInfo {
  candidate_name: string;
  candidate_phone?: string | null;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  email?: string | null;
  full_address: string;
}

interface ContactRequestProps {
  targetBiodataId: string;
  targetBiodataNumber: number;
  targetGender: string;
  isLoggedIn: boolean;
  isOwnBiodata: boolean;
  hasUserBiodata: boolean;
  userCredits: number;
  existingRequestStatus?: "pending" | "accepted" | "rejected" | null;
  unlockedContact?: UnlockedContactInfo | null;
}

export function ContactRequestButton({
  targetBiodataId,
  targetBiodataNumber,
  targetGender,
  isLoggedIn,
  isOwnBiodata,
  hasUserBiodata,
  userCredits,
  existingRequestStatus = null,
  unlockedContact = null,
}: ContactRequestProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. If not logged in
  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?next=/biodata/${targetBiodataId}`}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer"
      >
        <i className="ri-shield-user-line text-base" />
        <span>অভিভাবকের যোগাযোগের অনুরোধ করুন</span>
      </Link>
    );
  }

  // 2. If viewing own biodata
  if (isOwnBiodata) {
    return (
      <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand mb-2">
          <i className="ri-user-star-line" /> এটি আপনার নিজের বায়োডাটা
        </span>
        <p className="text-xs text-muted-foreground mb-3">
          আপনি আপনার বায়োডাটার তথ্য যেকোনো সময় সংশোধন করতে পারেন।
        </p>
        <Link
          href="/biodata/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
        >
          <i className="ri-edit-line" /> বায়োডাটা সম্পাদনা করুন
        </Link>
      </div>
    );
  }

  // 3. If request is ACCEPTED -> Unlocked Guardian Contacts
  if (existingRequestStatus === "accepted" && unlockedContact) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 text-left space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm pb-2 border-b border-emerald-200/80">
          <i className="ri-checkbox-circle-fill text-lg text-emerald-600" />
          <span>অভিভাবকের যোগাযোগের তথ্য (উন্মুক্ত)</span>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-foreground">
          <div className="flex justify-between border-b border-emerald-100 pb-1.5">
            <span className="text-muted-foreground">পাত্র/পাত্রীর নাম:</span>
            <span className="font-bold">{unlockedContact.candidate_name}</span>
          </div>

          <div className="flex justify-between border-b border-emerald-100 pb-1.5">
            <span className="text-muted-foreground">অভিভাবকের নাম:</span>
            <span className="font-bold">{unlockedContact.guardian_name}</span>
          </div>

          <div className="flex justify-between border-b border-emerald-100 pb-1.5">
            <span className="text-muted-foreground">সম্পর্ক:</span>
            <span className="font-semibold">{unlockedContact.guardian_relation}</span>
          </div>

          <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
            <span className="text-muted-foreground">অভিভাবকের মোবাইল:</span>
            <a
              href={`tel:${unlockedContact.guardian_phone}`}
              className="font-bold text-brand hover:underline inline-flex items-center gap-1 bg-brand/10 px-2 py-0.5 rounded"
            >
              <i className="ri-phone-fill text-xs" />
              <span>{unlockedContact.guardian_phone}</span>
            </a>
          </div>

          {unlockedContact.candidate_phone && (
            <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
              <span className="text-muted-foreground">ব্যক্তিগত মোবাইল:</span>
              <span className="font-semibold">{unlockedContact.candidate_phone}</span>
            </div>
          )}

          <div className="pt-1">
            <span className="text-muted-foreground block text-[11px] mb-0.5">পূর্ণ ঠিকানা:</span>
            <span className="font-medium text-xs leading-relaxed block bg-white/60 p-2 rounded border border-emerald-100">
              {unlockedContact.full_address}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-emerald-800/80 leading-relaxed pt-1">
          * উভয় পরিবারের সম্মান ও শালীনতা রক্ষা করে সরাসরি অভিভাবকের সাথে যোগাযোগ করার অনুরোধ করা
          হলো।
        </div>
      </div>
    );
  }

  // 4. If request is PENDING
  if (existingRequestStatus === "pending") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800">
          <i className="ri-time-line" /> প্রস্তাব পাঠানো হয়েছে (বিবেচনাধীন)
        </div>
        <p className="text-xs text-amber-900/90 leading-relaxed">
          আপনার প্রস্তাবটি প্রার্থীর অভিভাবকের কাছে পাঠানো হয়েছে। তিনি প্রস্তাব বিবেচনা করে গ্রহণ
          করলে এখানে অভিভাবকের যোগাযোগ নম্বর প্রদর্শিত হবে।
        </p>
      </div>
    );
  }

  // 5. If request is REJECTED
  if (existingRequestStatus === "rejected") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-bold text-rose-800 mb-1">
          <i className="ri-close-circle-line" /> প্রস্তাবটি গৃহীত হয়নি
        </span>
        <p className="text-xs text-rose-900/80">
          এই পরিবার আপনার অনুরোধটি গ্রহণ করেননি। আল্লাহ আপনার জন্য আরও উত্তম ব্যবস্থা করুন।
        </p>
      </div>
    );
  }

  // 6. Handle sending request
  const handleSend = () => {
    setError(null);
    startTransition(async () => {
      const res = await sendContactRequestAction(targetBiodataId, note);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(res.message || "অনুরোধ সফলভাবে পাঠানো হয়েছে।");
        setTimeout(() => {
          setIsOpen(false);
          router.refresh();
        }, 1500);
      }
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setError(null);
          setSuccessMsg(null);
          setIsOpen(true);
        }}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer active:scale-95"
      >
        <i className="ri-shield-user-line text-base" />
        <span>অভিভাবকের যোগাযোগের অনুরোধ করুন</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                  <i className="ri-mail-send-line text-lg" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-brand">
                    অভিভাবকের যোগাযোগের অনুরোধ
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    বায়োডাটা: ML-{toBengaliNumber(targetBiodataNumber)} (
                    {targetGender === "groom" ? "পাত্র" : "পাত্রী"})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-lg p-1 rounded-lg hover:bg-muted cursor-pointer"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            {/* Error or Success Banners */}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 flex items-start gap-2">
                <i className="ri-error-warning-line text-base text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <i className="ri-checkbox-circle-fill text-lg text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Modal Body */}
            {!successMsg && (
              <>
                {/* Condition 1: User has no biodata */}
                {!hasUserBiodata ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3 text-xs sm:text-sm text-amber-900">
                    <div className="font-bold flex items-center gap-2 text-amber-800">
                      <i className="ri-alert-line text-base" />
                      <span>আপনার বায়োডাটা তৈরি করা নেই</span>
                    </div>
                    <p className="leading-relaxed">
                      শরীয়াহ নীতিমালা অনুযায়ী যোগাযোগের প্রস্তাব পাঠানোর পূর্বে আপনার নিজের
                      বায়োডাটা তৈরি ও জমা দেওয়া আবশ্যক, যাতে পাত্র/পাত্রীর পরিবার আপনার তথ্য দেখে
                      সিদ্ধান্ত নিতে পারেন।
                    </p>
                    <Link
                      href="/biodata/create"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-brand-foreground hover:bg-brand/90 transition-all"
                    >
                      <span>এখনই বায়োডাটা তৈরি করুন</span>
                      <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                ) : userCredits < 1 ? (
                  /* Condition 2: No credits */
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-2 text-xs sm:text-sm text-rose-900">
                    <div className="font-bold flex items-center gap-2 text-rose-800">
                      <i className="ri-error-warning-line text-base" />
                      <span>যোগাযোগের ক্রেডিট অবশিষ্ট নেই</span>
                    </div>
                    <p className="leading-relaxed">
                      অভিভাবকের যোগাযোগ নম্বর দেখার অনুরোধ পাঠাতে নূন্যতম ১টি ক্রেডিট প্রয়োজন। নতুন
                      ক্রেডিট পেতে আমাদের সাপোর্ট সেন্টারে যোগাযোগ করুন।
                    </p>
                  </div>
                ) : (
                  /* Eligible to send */
                  <div className="space-y-4">
                    {/* Credit Notice */}
                    <div className="flex items-center justify-between rounded-xl border border-border/80 bg-lavender/40 p-3 text-xs">
                      <span className="text-muted-foreground">আপনার অবশিষ্ট ক্রেডিট:</span>
                      <span className="font-extrabold text-brand text-sm">
                        {toBengaliNumber(userCredits)} টি
                      </span>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground block mb-1">
                        কীভাবে প্রক্রিয়াটি কাজ করে?
                      </strong>
                      অনুরোধ পাঠানোর সাথে সাথে আপনার অ্যাকাউন্ট থেকে ১টি ক্রেডিট সংরক্ষিত হবে।
                      পাত্র/পাত্রীর অভিভাবক আপনার বায়োডাটা পর্যালোচনা করে প্রস্তাবে সম্মতি জানালে
                      তাঁর অভিভাবকের নাম ও ফোন নম্বর উন্মুক্ত হবে।
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        অভিভাবকের উদ্দেশ্যে সংক্ষিপ্ত বার্তা / সালাম (ঐচ্ছিক)
                      </label>
                      <textarea
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="যেমন: আসসালামু আলাইকুম, আমরা আপনার প্রার্থীর বায়োডাটা পছন্দ করেছি..."
                        className="w-full rounded-lg border border-input bg-card p-2.5 text-xs font-medium outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    বাতিল
                  </button>

                  {hasUserBiodata && userCredits >= 1 && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleSend}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-xs font-bold text-brand-foreground shadow-xs hover:bg-brand/90 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                    >
                      {isPending ? (
                        <>
                          <i className="ri-loader-4-line animate-spin" />
                          <span>পাঠানো হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-fill" />
                          <span>অনুরোধ পাঠান (১ ক্রেডিট)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
