import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

describe("Live Supabase Integration", () => {
  it("connects to Supabase and reads the biodatas table", async () => {
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

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();

    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { data, error } = await supabase.from("biodatas").select("*").limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
