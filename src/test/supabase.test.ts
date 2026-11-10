import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_BIODATA_CARD_COLUMNS =
  "id, biodata_number, gender, marital_status, birth_year, height_feet, height_inches, occupation, highest_degree, permanent_district, permanent_division";

function getSupabaseCredentials() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, "utf8");
      const urlMatch = raw.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
      const keyMatch = raw.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
      if (urlMatch?.[1]) supabaseUrl = urlMatch[1].trim();
      if (keyMatch?.[1]) supabaseKey = keyMatch[1].trim();
    }
  }

  return { supabaseUrl, supabaseKey };
}

describe("Live Supabase Integration & RLS Security", () => {
  it("reads public biodata card columns and enforces RLS on private tables and columns", async () => {
    const { supabaseUrl, supabaseKey } = getSupabaseCredentials();
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("example.supabase.co")) {
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("biodatas")
      .select(PUBLIC_BIODATA_CARD_COLUMNS)
      .eq("status", "approved")
      .limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);

    // Security regression check: profiles and biodata_contacts must never be readable by anon
    const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
    expect(profiles ?? []).toHaveLength(0);

    const { data: contacts } = await supabase
      .from("biodata_contacts")
      .select("biodata_id")
      .limit(1);
    expect(contacts ?? []).toHaveLength(0);
  });
});
