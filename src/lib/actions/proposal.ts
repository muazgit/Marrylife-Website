"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ProposalActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

/**
 * Send a contact request to a candidate's guardian
 */
export async function sendContactRequestAction(
  targetBiodataId: string,
  note?: string,
): Promise<ProposalActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: "অভিভাবকের যোগাযোগের অনুরোধ পাঠানোর জন্য অনুগ্রহ করে প্রথমে লগইন করুন।",
    };
  }

  // 1. Fetch target biodata
  const { data: targetBiodata, error: targetError } = await supabase
    .from("biodatas")
    .select("id, user_id, gender, status, biodata_number")
    .eq("id", targetBiodataId)
    .maybeSingle();

  if (targetError || !targetBiodata) {
    return { error: "বায়োডাটাটি খুঁজে পাওয়া যায়নি।" };
  }

  if (targetBiodata.status !== "approved") {
    return { error: "শুধুমাত্র অনুমোদিত বায়োডাটায় যোগাযোগের অনুরোধ পাঠানো সম্ভব।" };
  }

  if (targetBiodata.user_id === user.id) {
    return { error: "আপনি নিজের বায়োডাটায় যোগাযোগের অনুরোধ পাঠাতে পারবেন না।" };
  }

  // 2. Fetch sender's biodata
  const { data: senderBiodata, error: senderBioError } = await supabase
    .from("biodatas")
    .select("id, gender, status, biodata_number")
    .eq("user_id", user.id)
    .maybeSingle();

  if (senderBioError || !senderBiodata) {
    return {
      error:
        "যোগাযোগের অনুরোধ পাঠানোর পূর্বে আপনার নিজের বায়োডাটা তৈরি করা আবশ্যক, যাতে অপরপক্ষ আপনার তথ্য দেখতে পারেন।",
    };
  }

  // 3. Gender check: Must be opposite gender
  if (senderBiodata.gender === targetBiodata.gender) {
    return {
      error:
        "শরীয়াহ নীতিমালা অনুসারে শুধুমাত্র বিপরীত লিঙ্গের বায়োডাটায় বিয়ের প্রস্তাব পাঠানো সম্ভব।",
    };
  }

  // 4. Check for existing request
  const { data: existingRequest } = await supabase
    .from("contact_requests")
    .select("id, status")
    .eq("sender_id", user.id)
    .eq("target_biodata_id", targetBiodataId)
    .maybeSingle();

  if (existingRequest) {
    if (existingRequest.status === "pending") {
      return {
        error:
          "আপনি ইতিপূর্বে এই বায়োডাটায় যোগাযোগের অনুরোধ পাঠিয়েছেন, যা বর্তমানে বিবেচনাধীন রয়েছে।",
      };
    }
    if (existingRequest.status === "accepted") {
      return {
        error:
          "এই বায়োডাটার সাথে আপনার প্রস্তাব ইতিপূর্বে গৃহীত হয়েছে। অভিভাবকের যোগাযোগ নম্বর উন্মুক্ত রয়েছে।",
      };
    }
    if (existingRequest.status === "rejected") {
      return { error: "এই বায়োডাটার পরিবার আপনার পূর্বের প্রস্তাবটি গ্রহণ করেননি।" };
    }
  }

  // 5. Check sender's credit balance
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "প্রোফাইল লোড করতে ব্যর্থ হয়েছে।" };
  }

  if (profile.credits < 1) {
    return {
      error:
        "আপনার পর্যাপ্ত যোগাযোগের ক্রেডিট নেই। নতুন ক্রেডিট পেতে আমাদের সাপোর্ট সেন্টারে যোগাযোগ করুন।",
    };
  }

  // 6. Privileged execution with admin client (deducts 1 credit and inserts request)
  const adminClient = createAdminClient();

  // Insert contact request
  const { error: insertError } = await adminClient.from("contact_requests").insert({
    sender_id: user.id,
    sender_biodata_id: senderBiodata.id,
    target_biodata_id: targetBiodataId,
    status: "pending",
    guardian_response_note: note?.trim() || null,
  });

  if (insertError) {
    return { error: `অনুরোধ পাঠাতে ত্রুটি: ${insertError.message}` };
  }

  // Deduct 1 credit safely via admin client
  const { error: creditError } = await adminClient
    .from("profiles")
    .update({ credits: Math.max(0, profile.credits - 1) })
    .eq("id", user.id);

  if (creditError) {
    console.error("Failed to deduct credit:", creditError);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/biodata/${targetBiodataId}`);

  return {
    success: true,
    message:
      "আলহামদুলিল্লাহ! অভিভাবকের কাছে যোগাযোগের অনুরোধ সফলভাবে পাঠানো হয়েছে। ১টি ক্রেডিট কাটা হয়েছে।",
  };
}

/**
 * Respond to an incoming contact request (Accept or Reject)
 */
export async function respondContactRequestAction(
  requestId: string,
  action: "accept" | "reject",
  responseNote?: string,
): Promise<ProposalActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "অনুরোধের উত্তর দেওয়ার জন্য অনুগ্রহ করে লগইন করুন।" };
  }

  // Fetch request and verify ownership of target biodata
  const { data: request, error: reqError } = await supabase
    .from("contact_requests")
    .select("id, status, target_biodata_id, sender_id, biodatas:target_biodata_id(user_id)")
    .eq("id", requestId)
    .maybeSingle();

  if (reqError || !request) {
    return { error: "অনুরোধটি খুঁজে পাওয়া যায়নি।" };
  }

  // biodatas is array or object depending on relation
  const targetUserId = Array.isArray(request.biodatas)
    ? request.biodatas[0]?.user_id
    : (request.biodatas as { user_id: string } | null)?.user_id;

  if (targetUserId !== user.id) {
    return { error: "আপনি এই প্রস্তাবটির উত্তর দেওয়ার অনুমতিপ্রাপ্ত নন।" };
  }

  if (request.status !== "pending") {
    return { error: "এই অনুরোধটির উত্তর ইতিপূর্বে প্রদান করা হয়েছে।" };
  }

  const newStatus = action === "accept" ? "accepted" : "rejected";

  const adminClient = createAdminClient();
  const { error: updateError } = await adminClient
    .from("contact_requests")
    .update({
      status: newStatus,
      guardian_response_note: responseNote?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    return { error: `স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে: ${updateError.message}` };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/biodata/${request.target_biodata_id}`);

  return {
    success: true,
    message:
      action === "accept"
        ? "মাশাআল্লাহ! প্রস্তাবটি গ্রহণ করা হয়েছে। অপর পক্ষ এখন আপনার অভিভাবকের যোগাযোগের নম্বর দেখতে পাবেন।"
        : "প্রস্তাবটি বিনয়ের সাথে প্রত্যাখ্যান করা হয়েছে।",
  };
}

/**
 * Cancel a pending contact request sent by the user and refund 1 credit
 */
export async function cancelContactRequestAction(requestId: string): Promise<ProposalActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "অনুরোধ বাতিলের জন্য অনুগ্রহ করে লগইন করুন।" };
  }

  const { data: request, error: reqError } = await supabase
    .from("contact_requests")
    .select("id, status, sender_id")
    .eq("id", requestId)
    .maybeSingle();

  if (reqError || !request) {
    return { error: "অনুরোধটি খুঁজে পাওয়া যায়নি।" };
  }

  if (request.sender_id !== user.id) {
    return { error: "আপনি শুধুমাত্র নিজের পাঠানো অনুরোধ বাতিল করতে পারবেন।" };
  }

  if (request.status !== "pending") {
    return { error: "শুধুমাত্র বিবেচনাধীন (Pending) অনুরোধ বাতিল করা সম্ভব।" };
  }

  const adminClient = createAdminClient();

  // Delete or cancel request
  const { error: delError } = await adminClient
    .from("contact_requests")
    .delete()
    .eq("id", requestId);

  if (delError) {
    return { error: `অনুরোধ বাতিল করতে ত্রুটি: ${delError.message}` };
  }

  // Refund 1 credit
  const { data: profile } = await adminClient
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (profile) {
    await adminClient
      .from("profiles")
      .update({ credits: profile.credits + 1 })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "অনুরোধটি সফলভাবে প্রত্যাহার করা হয়েছে এবং আপনার ১টি ক্রেডিট ফেরত দেওয়া হয়েছে।",
  };
}
