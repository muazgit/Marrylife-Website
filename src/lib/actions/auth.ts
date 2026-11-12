"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  success?: string;
}

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const next = formData.get("next")?.toString() || "/dashboard";

  if (!email || !password) {
    return { error: "দয়া করে ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন।" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Translate common Supabase auth errors to friendly Bengali
    if (error.message.includes("Invalid login credentials")) {
      return { error: "ইমেইল বা পাসওয়ার্ড সঠিক নয়। দয়া করে আবার চেষ্টা করুন।" };
    }
    if (error.message.includes("Email not confirmed")) {
      return {
        error: "আপনার ইমেইল ঠিকানাটি এখনও যাচাই করা হয়নি। দয়া করে আপনার ইনবক্স চেক করুন।",
      };
    }
    return { error: `লগইন ব্যর্থ হয়েছে: ${error.message}` };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function registerAction(
  prevState: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const fullName = formData.get("full_name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();
  const terms = formData.get("terms");

  if (!fullName || !email || !password || !confirmPassword) {
    return { error: "দয়া করে সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।" };
  }

  if (password.length < 6) {
    return { error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" };
  }

  if (password !== confirmPassword) {
    return { error: "দুইটি পাসওয়ার্ড মেলেনি। অনুগ্রহ করে আবার যাচাই করুন।" };
  }

  if (!terms) {
    return { error: "শরীয়াহ নীতিমালা ও সত্যতা অঙ্গীকারে সম্মতি দেওয়া আবশ্যক।" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return {
        error: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।",
      };
    }
    return { error: `রেজিস্ট্রেশন ব্যর্থ হয়েছে: ${error.message}` };
  }

  // If user session exists immediately (email confirmation disabled in Supabase)
  if (data?.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    success:
      "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! আপনার ইমেইল ইনবক্সে পাঠানো লিঙ্কে ক্লিক করে অ্যাকাউন্ট সক্রিয় করুন, অথবা সরাসরি লগইন করুন।",
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
