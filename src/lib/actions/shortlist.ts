"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ShortlistToggleResult {
  success: boolean;
  isShortlisted?: boolean;
  requiresLocalSync?: boolean;
  message?: string;
  error?: string;
}

/**
 * Toggle shortlist status for a biodata in Supabase
 */
export async function toggleShortlistAction(biodataId: string): Promise<ShortlistToggleResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, client will manage in localStorage
  if (!user) {
    return {
      success: true,
      requiresLocalSync: true,
    };
  }

  // Check if already shortlisted
  const { data: existing } = await supabase
    .from("shortlists")
    .select("biodata_id")
    .eq("user_id", user.id)
    .eq("biodata_id", biodataId)
    .maybeSingle();

  if (existing) {
    // Remove from shortlists
    const { error: delError } = await supabase
      .from("shortlists")
      .delete()
      .eq("user_id", user.id)
      .eq("biodata_id", biodataId);

    if (delError) {
      return { success: false, error: delError.message };
    }

    revalidatePath("/shortlist");
    revalidatePath("/dashboard");
    return {
      success: true,
      isShortlisted: false,
      message: "বায়োডাটাটি আপনার শর্টলিস্ট থেকে মুছে ফেলা হয়েছে।",
    };
  } else {
    // Add to shortlists
    const { error: insError } = await supabase
      .from("shortlists")
      .insert({ user_id: user.id, biodata_id: biodataId });

    if (insError) {
      return { success: false, error: insError.message };
    }

    revalidatePath("/shortlist");
    revalidatePath("/dashboard");
    return {
      success: true,
      isShortlisted: true,
      message: "বায়োডাটাটি আপনার শর্টলিস্টে যুক্ত করা হয়েছে।",
    };
  }
}

/**
 * Sync local storage shortlisted IDs to Supabase when user logs in
 */
export async function syncLocalShortlistAction(
  biodataIds: string[],
): Promise<{ success: boolean; syncedCount?: number }> {
  if (!biodataIds || biodataIds.length === 0) {
    return { success: true, syncedCount: 0 };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false };
  }

  const rows = biodataIds.map((biodata_id) => ({
    user_id: user.id,
    biodata_id,
  }));

  const { error } = await supabase
    .from("shortlists")
    .upsert(rows, { onConflict: "user_id, biodata_id", ignoreDuplicates: true });

  if (error) {
    console.error("Failed to sync shortlists:", error);
    return { success: false };
  }

  revalidatePath("/shortlist");
  revalidatePath("/dashboard");
  return { success: true, syncedCount: biodataIds.length };
}

/**
 * Remove a specific biodata from the current user's shortlist
 */
export async function removeFromShortlistAction(
  biodataId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: true };
  }

  const { error } = await supabase
    .from("shortlists")
    .delete()
    .eq("user_id", user.id)
    .eq("biodata_id", biodataId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/shortlist");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Clear all shortlisted biodatas for the current user
 */
export async function clearAllShortlistsAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: true };
  }

  const { error } = await supabase.from("shortlists").delete().eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/shortlist");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Fetch public summaries of shortlisted biodatas by IDs
 */
export async function getShortlistedBiodatasAction(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("biodatas")
    .select(
      "id, biodata_number, gender, marital_status, birth_year, height_feet, height_inches, occupation, highest_degree, permanent_district, permanent_division",
    )
    .in("id", ids)
    .eq("status", "approved");

  if (error || !data) return [];
  return data;
}
