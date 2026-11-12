import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "লগইন করুন | MarryLife",
  description:
    "আপনার MarryLife অ্যাকাউন্টে লগইন করুন — বায়োডাটা তৈরি, সম্পাদনা ও অভিভাবকের সাথে যোগাযোগের সুযোগ নিন।",
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  // If already logged in, redirect to dashboard or next url
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(next || "/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {/* Card Header */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand mb-2.5">
              <i className="ri-shield-keyhole-line" /> নিরাপদ লগইন
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand">
              অ্যাকাউন্টে <span className="text-brand-pink">লগইন</span> করুন
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              দ্বীনদার পাত্র-পাত্রী খুঁজতে ও বায়োডাটা পরিচালনা করতে লগইন করুন
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-gray-100 bg-card p-6 sm:p-8 shadow-sm">
            <LoginForm nextUrl={next} />
          </div>

          {/* Security & Shariah Guarantee Notice */}
          <div className="mt-5 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <i className="ri-lock-2-line text-emerald-600" />
            <span>আপনার পাসওয়ার্ড ও ব্যক্তিগত তথ্য সম্পূর্ণ এনক্রিপ্টেড</span>
          </div>
        </div>
      </main>
    </div>
  );
}
