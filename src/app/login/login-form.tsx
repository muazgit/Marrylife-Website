"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm({ nextUrl }: { nextUrl?: string | undefined }) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {nextUrl && <input type="hidden" name="next" value={nextUrl} />}

      {/* Error Message */}
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-medium text-red-700 flex items-start gap-2 animate-in fade-in"
        >
          <i className="ri-error-warning-fill text-red-500 text-base shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Success Message */}
      {state?.success && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm font-medium text-emerald-800 flex items-start gap-2 animate-in fade-in"
        >
          <i className="ri-checkbox-circle-fill text-emerald-600 text-base shrink-0 mt-0.5" />
          <span>{state.success}</span>
        </div>
      )}

      {/* Email input */}
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

      {/* Password input */}
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
            autoComplete="current-password"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand py-2.5 sm:py-3 text-sm font-bold text-brand-foreground shadow-sm transition-all hover:bg-brand/90 hover:shadow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
      >
        {isPending ? (
          <>
            <i className="ri-loader-4-line animate-spin text-lg" />
            <span>লগইন হচ্ছে...</span>
          </>
        ) : (
          <>
            <i className="ri-login-box-line text-lg" />
            <span>লগইন করুন</span>
          </>
        )}
      </button>

      {/* Register redirect link */}
      <div className="pt-3 border-t border-border/60 text-center text-xs sm:text-sm text-muted-foreground">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href={`/register${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`}
          className="font-bold text-brand-pink hover:underline"
        >
          বিনামূল্যে রেজিস্ট্রেশন করুন
        </Link>
      </div>
    </form>
  );
}
