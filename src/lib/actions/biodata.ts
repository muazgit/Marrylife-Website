"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export interface BiodataFormState {
  error?: string;
  success?: boolean;
  message?: string;
  biodataId?: string;
  biodataNumber?: number;
}

export type GenderType = Database["public"]["Enums"]["gender_type"];
export type MaritalStatusType = Database["public"]["Enums"]["marital_status_type"];

export interface BiodataPayload {
  // Step 1: General Info
  gender: GenderType;
  marital_status: MaritalStatusType;
  birth_year: number;
  height_feet: number;
  height_inches: number;
  weight_kg?: number | null;
  complexion: string;
  blood_group?: string | null;

  // Step 2: Location
  division: string;
  district: string;
  upazila: string;
  permanent_division: string;
  permanent_district: string;
  permanent_upazila?: string | null;

  // Step 3: Education & Career
  education_medium: string;
  highest_degree: string;
  occupation: string;
  monthly_income?: string | null;

  // Step 4: Religious Practice
  prayer_frequency: string;
  observes_purdah_or_beard: boolean;
  mahram_non_mahram_care: boolean;
  quran_recitation_ability?: string | null;
  religious_sect?: string | null;

  // Step 5: Family
  father_occupation?: string | null;
  mother_occupation?: string | null;
  brothers_count?: number | null;
  sisters_count?: number | null;
  financial_status?: string | null;

  // Step 6: Expected Partner
  expected_partner_age_min?: number | null;
  expected_partner_age_max?: number | null;
  expected_partner_height_min?: string | null;
  expected_partner_district?: string[] | null;
  expected_partner_qualities: string;

  // Step 7: Guardian & Contact
  candidate_name: string;
  candidate_phone?: string | null;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  guardian_agreement: boolean;
  email?: string | null;
  full_address: string;
}

export async function saveBiodataAction(payload: BiodataPayload): Promise<BiodataFormState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: "বায়োডাটা সংরক্ষণ করার জন্য অনুগ্রহ করে প্রথমে লগইন করুন।",
    };
  }

  // --- Strict Validation ---
  if (!payload.gender || !["groom", "bride"].includes(payload.gender)) {
    return { error: "অনুগ্রহ করে পাত্র অথবা পাত্রী নির্বাচন করুন।" };
  }

  if (
    !payload.marital_status ||
    !["never_married", "divorced", "widowed", "separated"].includes(payload.marital_status)
  ) {
    return { error: "অনুগ্রহ করে সঠিক বৈবাহিক অবস্থা নির্বাচন করুন।" };
  }

  const currentYear = new Date().getFullYear();
  if (!payload.birth_year || payload.birth_year < 1960 || payload.birth_year > currentYear - 16) {
    return { error: "অনুগ্রহ করে একটি গ্রহণযোগ্য জন্ম সাল প্রদান করুন (কমপক্ষে ১৬ বছর বয়স)।" };
  }

  if (
    payload.height_feet === undefined ||
    payload.height_feet < 3 ||
    payload.height_feet > 7 ||
    payload.height_inches === undefined ||
    payload.height_inches < 0 ||
    payload.height_inches > 11
  ) {
    return { error: "অনুগ্রহ করে সঠিক উচ্চতা (ফুট ও ইঞ্চি) প্রদান করুন।" };
  }

  if (!payload.complexion?.trim()) {
    return { error: "অনুগ্রহ করে গায়ের রঙ নির্বাচন করুন।" };
  }

  if (!payload.division?.trim() || !payload.district?.trim() || !payload.upazila?.trim()) {
    return { error: "অনুগ্রহ করে বর্তমান বিভাগ, জেলা এবং উপজেলা সঠিকভাবে পূরণ করুন।" };
  }

  if (!payload.permanent_division?.trim() || !payload.permanent_district?.trim()) {
    return { error: "অনুগ্রহ করে স্থায়ী বিভাগ এবং জেলা সঠিকভাবে পূরণ করুন।" };
  }

  if (!payload.education_medium?.trim()) {
    return { error: "অনুগ্রহ করে শিক্ষা মাধ্যম নির্বাচন করুন।" };
  }

  if (!payload.highest_degree?.trim()) {
    return { error: "অনুগ্রহ করে সর্বোচ্চ শিক্ষাগত যোগ্যতা প্রদান করুন।" };
  }

  if (!payload.occupation?.trim()) {
    return { error: "অনুগ্রহ করে পেশা উল্লেখ করুন।" };
  }

  if (!payload.prayer_frequency?.trim()) {
    return { error: "অনুগ্রহ করে নামাজের বিবরণ প্রদান করুন।" };
  }

  if (
    !payload.expected_partner_qualities?.trim() ||
    payload.expected_partner_qualities.trim().length < 10
  ) {
    return { error: "প্রত্যাশিত জীবনসঙ্গীর বৈশিষ্ট্য কমপক্ষে ১০ অক্ষরে বিস্তারিত লিখুন।" };
  }

  // Contact Info Validation
  if (!payload.candidate_name?.trim()) {
    return { error: "পাত্র/পাত্রীর পূর্ণ নাম উল্লেখ করা আবশ্যক।" };
  }

  if (!payload.guardian_name?.trim()) {
    return { error: "অভিভাবকের নাম উল্লেখ করা আবশ্যক।" };
  }

  if (!payload.guardian_relation?.trim()) {
    return { error: "অভিভাবকের সাথে সম্পর্ক নির্বাচন করা আবশ্যক।" };
  }

  if (!payload.guardian_phone?.trim() || payload.guardian_phone.trim().length < 11) {
    return { error: "অনুগ্রহ করে অভিভাবকের সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।" };
  }

  if (!payload.guardian_agreement) {
    return { error: "বায়োডাটা জমা দেওয়ার পূর্বে অভিভাবকের পূর্ণ সম্মতি থাকা আবশ্যক।" };
  }

  if (!payload.full_address?.trim() || payload.full_address.trim().length < 8) {
    return { error: "অনুগ্রহ করে পূর্ণ যোগাযোগের ঠিকানা বিস্তারিত লিখুন।" };
  }

  try {
    // Check if user already owns a biodata
    const { data: existingBiodata } = await supabase
      .from("biodatas")
      .select("id, biodata_number")
      .eq("user_id", user.id)
      .maybeSingle();

    let targetBiodataId: string;
    let biodataNumber: number;

    const biodataRow = {
      gender: payload.gender,
      marital_status: payload.marital_status,
      birth_year: Number(payload.birth_year),
      height_feet: Number(payload.height_feet),
      height_inches: Number(payload.height_inches),
      weight_kg: payload.weight_kg ? Number(payload.weight_kg) : null,
      complexion: payload.complexion.trim(),
      blood_group: payload.blood_group?.trim() || null,
      prayer_frequency: payload.prayer_frequency.trim(),
      observes_purdah_or_beard: Boolean(payload.observes_purdah_or_beard),
      mahram_non_mahram_care: Boolean(payload.mahram_non_mahram_care),
      quran_recitation_ability: payload.quran_recitation_ability?.trim() || null,
      religious_sect: payload.religious_sect?.trim() || "সুন্নি",
      education_medium: payload.education_medium.trim(),
      highest_degree: payload.highest_degree.trim(),
      occupation: payload.occupation.trim(),
      monthly_income: payload.monthly_income?.trim() || null,
      division: payload.division.trim(),
      district: payload.district.trim(),
      upazila: payload.upazila.trim(),
      permanent_division: payload.permanent_division.trim(),
      permanent_district: payload.permanent_district.trim(),
      permanent_upazila: payload.permanent_upazila?.trim() || null,
      father_occupation: payload.father_occupation?.trim() || null,
      mother_occupation: payload.mother_occupation?.trim() || null,
      brothers_count: Number(payload.brothers_count ?? 0),
      sisters_count: Number(payload.sisters_count ?? 0),
      financial_status: payload.financial_status?.trim() || null,
      expected_partner_age_min: payload.expected_partner_age_min
        ? Number(payload.expected_partner_age_min)
        : null,
      expected_partner_age_max: payload.expected_partner_age_max
        ? Number(payload.expected_partner_age_max)
        : null,
      expected_partner_height_min: payload.expected_partner_height_min?.trim() || null,
      expected_partner_district: payload.expected_partner_district?.length
        ? payload.expected_partner_district
        : null,
      expected_partner_qualities: payload.expected_partner_qualities.trim(),
      status: "pending_approval" as const,
      updated_at: new Date().toISOString(),
    };

    if (existingBiodata) {
      // Update existing
      targetBiodataId = existingBiodata.id;
      biodataNumber = existingBiodata.biodata_number;

      const { error: updateError } = await supabase
        .from("biodatas")
        .update(biodataRow)
        .eq("id", targetBiodataId);

      if (updateError) {
        return { error: `বায়োডাটা আপডেট করতে ত্রুটি: ${updateError.message}` };
      }
    } else {
      // Insert new
      const { data: newRow, error: insertError } = await supabase
        .from("biodatas")
        .insert({
          ...biodataRow,
          user_id: user.id,
        })
        .select("id, biodata_number")
        .single();

      if (insertError || !newRow) {
        return { error: `নতুন বায়োডাটা তৈরিতে ত্রুটি: ${insertError?.message || "অজানা সমস্যা"}` };
      }

      targetBiodataId = newRow.id;
      biodataNumber = newRow.biodata_number;
    }

    // Save Protected Contact Details
    const contactRow = {
      biodata_id: targetBiodataId,
      candidate_name: payload.candidate_name.trim(),
      candidate_phone: payload.candidate_phone?.trim() || null,
      guardian_name: payload.guardian_name.trim(),
      guardian_relation: payload.guardian_relation.trim(),
      guardian_phone: payload.guardian_phone.trim(),
      guardian_agreement: true,
      email: payload.email?.trim() || user.email || null,
      full_address: payload.full_address.trim(),
    };

    const { error: contactError } = await supabase
      .from("biodata_contacts")
      .upsert(contactRow, { onConflict: "biodata_id" });

    if (contactError) {
      return {
        error: `যোগাযোগের তথ্য সংরক্ষণে ত্রুটি: ${contactError.message}`,
      };
    }

    // Revalidate affected routes
    revalidatePath("/dashboard");
    revalidatePath("/biodatas");
    revalidatePath(`/biodata/${targetBiodataId}`);

    return {
      success: true,
      biodataId: targetBiodataId,
      biodataNumber,
      message:
        "আলহামদুলিল্লাহ! আপনার বায়োডাটা সফলভাবে সংরক্ষিত ও যাচাইয়ের জন্য জমা দেওয়া হয়েছে।",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "অপ্রত্যাশিত সার্ভার ত্রুটি";
    return { error: `বায়োডাটা সংরক্ষণ ব্যর্থ হয়েছে: ${errorMsg}` };
  }
}
