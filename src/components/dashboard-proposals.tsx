"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { respondContactRequestAction, cancelContactRequestAction } from "@/lib/actions/proposal";
import { toBengaliNumber } from "@/lib/utils/bengali";

export interface ProposalItem {
  id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  created_at: string;
  guardian_response_note?: string | null;
  biodata: {
    id: string;
    biodata_number: number;
    gender: string;
    occupation: string;
    permanent_district: string;
    permanent_division: string;
  } | null;
}

interface DashboardProposalsProps {
  receivedProposals: ProposalItem[];
  sentProposals: ProposalItem[];
}

interface StatusConfigItem {
  label: string;
  badgeClass: string;
  icon: string;
}

const DEFAULT_STATUS_CONFIG: StatusConfigItem = {
  label: "বিবেচনাধীন",
  badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  icon: "ri-time-line",
};

const STATUS_CONFIG: Record<string, StatusConfigItem> = {
  pending: DEFAULT_STATUS_CONFIG,
  accepted: {
    label: "গৃহীত হয়েছে",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "ri-checkbox-circle-fill",
  },
  rejected: {
    label: "প্রত্যাখ্যাত",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: "ri-close-circle-line",
  },
  cancelled: {
    label: "প্রত্যাহারকৃত",
    badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
    icon: "ri-forbid-line",
  },
};

function getStatusConfig(status: string): StatusConfigItem {
  return STATUS_CONFIG[status] ?? DEFAULT_STATUS_CONFIG;
}

export function DashboardProposals({ receivedProposals, sentProposals }: DashboardProposalsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const pendingReceivedCount = receivedProposals.filter((p) => p.status === "pending").length;

  const handleRespond = (requestId: string, action: "accept" | "reject") => {
    setActionError(null);
    setActionSuccess(null);
    startTransition(async () => {
      const res = await respondContactRequestAction(requestId, action);
      if (res.error) {
        setActionError(res.error);
      } else {
        setActionSuccess(res.message || "সফল হয়েছে।");
        router.refresh();
      }
    });
  };

  const handleCancel = (requestId: string) => {
    if (
      !confirm("আপনি কি নিশ্চিতভাবে এই অনুরোধটি প্রত্যাহার করতে চান? আপনার ১টি ক্রেডিট ফেরত পাবেন।")
    ) {
      return;
    }
    setActionError(null);
    setActionSuccess(null);
    startTransition(async () => {
      const res = await cancelContactRequestAction(requestId);
      if (res.error) {
        setActionError(res.error);
      } else {
        setActionSuccess(res.message || "অনুরোধটি প্রত্যাহার করা হয়েছে।");
        router.refresh();
      }
    });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-card p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-brand flex items-center gap-2">
            <i className="ri-mail-unread-line text-brand-pink" />
            বিয়ের প্রস্তাব ও যোগাযোগের অনুরোধ
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            আপনার পাঠানো ও প্রাপ্ত অভিভাবক যোগাযোগের প্রস্তাবসমূহ পরিচালনা করুন
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setActionSuccess(null);
              setActiveTab("received");
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "received"
                ? "bg-card text-brand shadow-2xs font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <i className="ri-inbox-archive-line" />
            <span>প্রাপ্ত প্রস্তাব</span>
            {pendingReceivedCount > 0 && (
              <span className="h-5 min-w-5 px-1.5 rounded-full bg-brand-pink text-white text-[10px] flex items-center justify-center font-bold">
                {toBengaliNumber(pendingReceivedCount)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setActionSuccess(null);
              setActiveTab("sent");
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "sent"
                ? "bg-card text-brand shadow-2xs font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <i className="ri-send-plane-line" />
            <span>প্রেরিত অনুরোধ</span>
            {sentProposals.length > 0 && (
              <span className="h-5 min-w-5 px-1.5 rounded-full bg-brand/10 text-brand text-[10px] flex items-center justify-center font-bold">
                {toBengaliNumber(sentProposals.length)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 flex items-center gap-2">
          <i className="ri-error-warning-line text-base text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <i className="ri-checkbox-circle-fill text-lg text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ================= TAB 1: RECEIVED PROPOSALS (INBOX) ================= */}
      {activeTab === "received" && (
        <div className="space-y-4">
          {receivedProposals.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border/80 bg-lavender/20">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <i className="ri-inbox-line text-2xl" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">কোনো প্রাপ্ত প্রস্তাব নেই</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                আপনার বায়োডাটা সক্রিয় থাকলে অন্যান্য পাত্র/পাত্রীর অভিভাবক আপনাকে যোগাযোগের অনুরোধ
                পাঠাতে পারবেন।
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {receivedProposals.map((item) => {
                const bio = item.biodata;
                const statusConf = getStatusConfig(item.status);
                return (
                  <div
                    key={item.id}
                    className="py-4.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm text-brand">
                          {bio ? `ML-${toBengaliNumber(bio.biodata_number)}` : "বায়োডাটা"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusConf.badgeClass}`}
                        >
                          <i className={`${statusConf.icon} text-xs`} />
                          <span>{statusConf.label}</span>
                        </span>
                      </div>

                      {bio && (
                        <p className="text-xs text-muted-foreground">
                          {bio.gender === "groom" ? "পাত্র" : "পাত্রী"} · {bio.occupation} ·{" "}
                          {bio.permanent_district}, {bio.permanent_division}
                        </p>
                      )}

                      {item.guardian_response_note && (
                        <div className="text-xs text-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50 max-w-md italic">
                          &ldquo;{item.guardian_response_note}&rdquo;
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {bio && (
                        <Link
                          href={`/biodata/${bio.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <i className="ri-eye-line" />
                          <span>বায়োডাটা দেখুন</span>
                        </Link>
                      )}

                      {item.status === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleRespond(item.id, "accept")}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <i className="ri-check-line" />
                            <span>সম্মতি দিন</span>
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleRespond(item.id, "reject")}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <i className="ri-close-line" />
                            <span>প্রত্যাখ্যান</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SENT PROPOSALS (OUTBOX) ================= */}
      {activeTab === "sent" && (
        <div className="space-y-4">
          {sentProposals.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border/80 bg-lavender/20">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <i className="ri-send-plane-line text-2xl" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">কোনো অনুরোধ পাঠানো হয়নি</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                আপনি পছন্দনীয় পাত্র বা পাত্রীর অভিভাবকের সাথে যোগাযোগের জন্য অনুরোধ পাঠাতে পারেন।
              </p>
              <Link
                href="/biodatas"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-brand-foreground hover:bg-brand/90 transition-all cursor-pointer"
              >
                <i className="ri-search-eye-line" />
                <span>বায়োডাটা অনুসন্ধান করুন</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sentProposals.map((item) => {
                const bio = item.biodata;
                const statusConf = getStatusConfig(item.status);
                return (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm text-brand">
                          {bio ? `ML-${toBengaliNumber(bio.biodata_number)}` : "বায়োডাটা"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusConf.badgeClass}`}
                        >
                          <i className={`${statusConf.icon} text-xs`} />
                          <span>{statusConf.label}</span>
                        </span>
                      </div>

                      {bio && (
                        <p className="text-xs text-muted-foreground">
                          {bio.gender === "groom" ? "পাত্র" : "পাত্রী"} · {bio.occupation} ·{" "}
                          {bio.permanent_district}, {bio.permanent_division}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {bio && (
                        <Link
                          href={`/biodata/${bio.id}`}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                            item.status === "accepted"
                              ? "bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700"
                              : "border border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          <i
                            className={item.status === "accepted" ? "ri-phone-fill" : "ri-eye-line"}
                          />
                          <span>
                            {item.status === "accepted"
                              ? "অভিভাবকের নম্বর দেখুন"
                              : "বায়োডাটা দেখুন"}
                          </span>
                        </Link>
                      )}

                      {item.status === "pending" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleCancel(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <i className="ri-close-line" />
                          <span>অনুরোধ প্রত্যাহার</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
