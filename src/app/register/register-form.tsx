"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";

export function RegisterForm({ nextUrl }: { nextUrl?: string | undefined }) {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {nextUrl && <input type="hidden" name="next" value={nextUrl} />}

      {/* Error Alert */}
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-medium text-red-700 flex items-start gap-2 animate-in fade-in"
        >
          <i className="ri-error-warning-fill text-red-500 text-base shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Success Alert */}
      {state?.success && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-medium text-emerald-800 flex items-start gap-2 animate-in fade-in"
        >
          <i className="ri-checkbox-circle-fill text-emerald-600 text-lg shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p>{state.success}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
            >
              <i className="ri-arrow-right-line" /> এখনই লগইন পৃষ্ঠায় যান
            </Link>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="full_name"
          className="block text-xs sm:text-sm font-bold text-foreground mb-1.5"
        >
          আপনার পূর্ণ নাম
        </label>
        <div className="relative">
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
            className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <i className="ri-user-line absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs sm:text-sm font-bold text-foreground mb-1.5"
        >
          ইমেইল এড্রেস
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="example@mail.com"
            className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <i className="ri-mail-line absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none" />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-foreground">
            পাসওয়ার্ড
          </label>
          <span className="text-[11px] text-muted-foreground">কমপক্ষে ৬ অক্ষর</span>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-base transition-colors cursor-pointer"
          >
            <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirm_password"
          className="block text-xs sm:text-sm font-bold text-foreground mb-1.5"
        >
          পাসওয়ার্ড নিশ্চিত করুন
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            name="confirm_password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <i className="ri-lock-password-line absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none" />
        </div>
      </div>

      {/* Shariah & Honesty Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground leading-relaxed">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand/30 cursor-pointer"
          />
          <span>
            আমি সাক্ষ্য দিচ্ছি যে আমি শুধুমাত্র দ্বীনদার জীবনসঙ্গী খোঁজার সৎ ও শরীয়াহসম্মত
            উদ্দেশ্যে সঠিক তথ্য প্রদান করব এবং প্ল্যাটফর্মের{" "}
            <Link href="/terms" target="_blank" className="font-bold text-brand hover:underline">
              শর্তাবলী
            </Link>{" "}
            মেনে চলব।
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand py-2.5 sm:py-3 text-sm font-bold text-brand-foreground shadow-sm transition-all hover:bg-brand/90 hover:shadow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
      >
        {isPending ? (
          <>
            <i className="ri-loader-4-line animate-spin text-lg" />
            <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
          </>
        ) : (
          <>
            <i className="ri-user-add-line text-lg" />
            <span>বিনামূল্যে অ্যাকাউন্ট তৈরি করুন</span>
          </>
        )}
      </button>

      {/* Login redirect link */}
      <div className="pt-3 border-t border-border/60 text-center text-xs sm:text-sm text-muted-foreground">
        ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
        <Link
          href={`/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`}
          className="font-bold text-brand-pink hover:underline"
        >
          লগইন করুন
        </Link>
      </div>
    </form>
  );
}
