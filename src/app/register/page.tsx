import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "রেজিস্ট্রেশন করুন | MarryLife",
  description:
    "MarryLife-এ বিনামূল্যে অ্যাকাউন্ট তৈরি করুন — দ্বীনদার পাত্র-পাত্রী খুঁজুন এবং সম্পূর্ণ শরীয়াহসম্মত উপায়ে বায়োডাটা তৈরি করুন।",
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: PageProps) {
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
              <i className="ri-user-star-line" /> সম্পূর্ণ বিনামূল্যে
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand">
              অ্যাকাউন্ট <span className="text-brand-pink">তৈরি</span> করুন
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              দ্বীনদার জীবনসঙ্গী খোঁজার বিশ্বস্ত ও নিরাপদ প্ল্যাটফর্ম
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-gray-100 bg-card p-6 sm:p-8 shadow-sm">
            <RegisterForm nextUrl={next} />
          </div>

          {/* Privacy Footnote */}
          <div className="mt-5 text-center text-xs text-muted-foreground">
            রেজিস্ট্রেশনের মাধ্যমে আপনি স্বয়ংক্রিয়ভাবে ৫টি অভিভাবক যোগাযোগের ক্রেডিট পাবেন।
          </div>
        </div>
      </main>
    </div>
  );
}
