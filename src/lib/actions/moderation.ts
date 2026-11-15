"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ModerationActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Helper to verify whether current user has staff permissions (admin or moderator)
 */
async function verifyStaffUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { isStaff: false, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isStaff = profile?.role === "admin" || profile?.role === "moderator";
  return { isStaff, user };
}

/**
 * Approve a pending biodata
 */
export async function approveBiodataAction(biodataId: string): Promise<ModerationActionResult> {
  const { isStaff, user } = await verifyStaffUser();
  if (!isStaff || !user) {
    return { success: false, error: "আপনার এই কাজটি করার অনুমতি নেই।" };
  }

  const adminClient = createAdminClient();

  const { error: updateError } = await adminClient
    .from("biodatas")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      rejection_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", biodataId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Insert moderation log
  await adminClient.from("moderation_logs").insert({
    moderator_id: user.id,
    biodata_id: biodataId,
    action: "approve",
    note: "বায়োডাটা সফলভাবে অনুমোদন করা হয়েছে।",
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/biodatas");
  revalidatePath(`/biodata/${biodataId}`);
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "বায়োডাটাটি সফলভাবে অনুমোদন করা হয়েছে এবং পাবলিক তালিকায় উন্মুক্ত হয়েছে।",
  };
}

/**
 * Reject a biodata with feedback/reason for correction
 */
export async function rejectBiodataAction(
  biodataId: string,
  reason: string,
): Promise<ModerationActionResult> {
  const { isStaff, user } = await verifyStaffUser();
  if (!isStaff || !user) {
    return { success: false, error: "আপনার এই কাজটি করার অনুমতি নেই।" };
  }

  if (!reason?.trim() || reason.trim().length < 5) {
    return {
      success: false,
      error: "অনুগ্রহ করে বাতিল বা সংশোধনের সুনির্দিষ্ট কারণ বিস্তারিত লিখুন (কমপক্ষে ৫ অক্ষর)।",
    };
  }

  const adminClient = createAdminClient();

  const { error: updateError } = await adminClient
    .from("biodatas")
    .update({
      status: "rejected",
      rejection_reason: reason.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", biodataId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Insert moderation log
  await adminClient.from("moderation_logs").insert({
    moderator_id: user.id,
    biodata_id: biodataId,
    action: "reject",
    note: reason.trim(),
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/biodatas");
  revalidatePath(`/biodata/${biodataId}`);
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "বায়োডাটাটি সংশোধনের জন্য ফেরত পাঠানো হয়েছে এবং ব্যবহারকারীকে কারণ জানানো হয়েছে।",
  };
}
