export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      biodata_contacts: {
        Row: {
          biodata_id: string;
          candidate_name: string;
          candidate_phone: string | null;
          created_at: string;
          email: string | null;
          full_address: string;
          guardian_agreement: boolean;
          guardian_name: string;
          guardian_phone: string;
          guardian_relation: string;
        };
        Insert: {
          biodata_id: string;
          candidate_name: string;
          candidate_phone?: string | null;
          created_at?: string;
          email?: string | null;
          full_address: string;
          guardian_agreement?: boolean;
          guardian_name: string;
          guardian_phone: string;
          guardian_relation: string;
        };
        Update: {
          biodata_id?: string;
          candidate_name?: string;
          candidate_phone?: string | null;
          created_at?: string;
          email?: string | null;
          full_address?: string;
          guardian_agreement?: boolean;
          guardian_name?: string;
          guardian_phone?: string;
          guardian_relation?: string;
        };
        Relationships: [
          {
            foreignKeyName: "biodata_contacts_biodata_id_fkey";
            columns: ["biodata_id"];
            isOneToOne: true;
            referencedRelation: "biodatas";
            referencedColumns: ["id"];
          },
        ];
      };
      biodatas: {
        Row: {
          approved_at: string | null;
          biodata_number: number;
          birth_year: number;
          blood_group: string | null;
          brothers_count: number | null;
          complexion: string;
          created_at: string;
          district: string;
          division: string;
          education_medium: string;
          expected_partner_age_max: number | null;
          expected_partner_age_min: number | null;
          expected_partner_district: string[] | null;
          expected_partner_height_min: string | null;
          expected_partner_qualities: string;
          father_occupation: string | null;
          financial_status: string | null;
          gender: Database["public"]["Enums"]["gender_type"];
          height_feet: number;
          height_inches: number;
          highest_degree: string;
          id: string;
          mahram_non_mahram_care: boolean;
          marital_status: Database["public"]["Enums"]["marital_status_type"];
          monthly_income: string | null;
          mother_occupation: string | null;
          observes_purdah_or_beard: boolean;
          occupation: string;
          permanent_district: string;
          permanent_division: string;
          permanent_upazila: string | null;
          prayer_frequency: string;
          quran_recitation_ability: string | null;
          rejection_reason: string | null;
          religious_sect: string | null;
          sisters_count: number | null;
          status: Database["public"]["Enums"]["biodata_status"];
          upazila: string;
          updated_at: string;
          user_id: string;
          weight_kg: number | null;
        };
        Insert: {
          approved_at?: string | null;
          biodata_number?: number;
          birth_year: number;
          blood_group?: string | null;
          brothers_count?: number | null;
          complexion: string;
          created_at?: string;
          district: string;
          division: string;
          education_medium: string;
          expected_partner_age_max?: number | null;
          expected_partner_age_min?: number | null;
          expected_partner_district?: string[] | null;
          expected_partner_height_min?: string | null;
          expected_partner_qualities: string;
          father_occupation?: string | null;
          financial_status?: string | null;
          gender: Database["public"]["Enums"]["gender_type"];
          height_feet: number;
          height_inches: number;
          highest_degree: string;
          id?: string;
          mahram_non_mahram_care?: boolean;
          marital_status: Database["public"]["Enums"]["marital_status_type"];
          monthly_income?: string | null;
          mother_occupation?: string | null;
          observes_purdah_or_beard?: boolean;
          occupation: string;
          permanent_district: string;
          permanent_division: string;
          permanent_upazila?: string | null;
          prayer_frequency?: string;
          quran_recitation_ability?: string | null;
          rejection_reason?: string | null;
          religious_sect?: string | null;
          sisters_count?: number | null;
          status?: Database["public"]["Enums"]["biodata_status"];
          upazila: string;
          updated_at?: string;
          user_id: string;
          weight_kg?: number | null;
        };
        Update: {
          approved_at?: string | null;
          biodata_number?: number;
          birth_year?: number;
          blood_group?: string | null;
          brothers_count?: number | null;
          complexion?: string;
          created_at?: string;
          district?: string;
          division?: string;
          education_medium?: string;
          expected_partner_age_max?: number | null;
          expected_partner_age_min?: number | null;
          expected_partner_district?: string[] | null;
          expected_partner_height_min?: string | null;
          expected_partner_qualities?: string;
          father_occupation?: string | null;
          financial_status?: string | null;
          gender?: Database["public"]["Enums"]["gender_type"];
          height_feet?: number;
          height_inches?: number;
          highest_degree?: string;
          id?: string;
          mahram_non_mahram_care?: boolean;
          marital_status?: Database["public"]["Enums"]["marital_status_type"];
          monthly_income?: string | null;
          mother_occupation?: string | null;
          observes_purdah_or_beard?: boolean;
          occupation?: string;
          permanent_district?: string;
          permanent_division?: string;
          permanent_upazila?: string | null;
          prayer_frequency?: string;
          quran_recitation_ability?: string | null;
          rejection_reason?: string | null;
          religious_sect?: string | null;
          sisters_count?: number | null;
          status?: Database["public"]["Enums"]["biodata_status"];
          upazila?: string;
          updated_at?: string;
          user_id?: string;
          weight_kg?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "biodatas_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_requests: {
        Row: {
          created_at: string;
          guardian_response_note: string | null;
          id: string;
          sender_biodata_id: string;
          sender_id: string;
          status: Database["public"]["Enums"]["request_status"];
          target_biodata_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          guardian_response_note?: string | null;
          id?: string;
          sender_biodata_id: string;
          sender_id: string;
          status?: Database["public"]["Enums"]["request_status"];
          target_biodata_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          guardian_response_note?: string | null;
          id?: string;
          sender_biodata_id?: string;
          sender_id?: string;
          status?: Database["public"]["Enums"]["request_status"];
          target_biodata_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_requests_sender_biodata_id_fkey";
            columns: ["sender_biodata_id"];
            isOneToOne: false;
            referencedRelation: "biodatas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_requests_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_requests_target_biodata_id_fkey";
            columns: ["target_biodata_id"];
            isOneToOne: false;
            referencedRelation: "biodatas";
            referencedColumns: ["id"];
          },
        ];
      };
      moderation_logs: {
        Row: {
          action: string;
          biodata_id: string;
          created_at: string;
          id: string;
          moderator_id: string;
          note: string | null;
        };
        Insert: {
          action: string;
          biodata_id: string;
          created_at?: string;
          id?: string;
          moderator_id: string;
          note?: string | null;
        };
        Update: {
          action?: string;
          biodata_id?: string;
          created_at?: string;
          id?: string;
          moderator_id?: string;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "moderation_logs_biodata_id_fkey";
            columns: ["biodata_id"];
            isOneToOne: false;
            referencedRelation: "biodatas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "moderation_logs_moderator_id_fkey";
            columns: ["moderator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          credits: number;
          full_name: string;
          id: string;
          is_verified: boolean;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          credits?: number;
          full_name?: string;
          id: string;
          is_verified?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          credits?: number;
          full_name?: string;
          id?: string;
          is_verified?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      shortlists: {
        Row: {
          biodata_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          biodata_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          biodata_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shortlists_biodata_id_fkey";
            columns: ["biodata_id"];
            isOneToOne: false;
            referencedRelation: "biodatas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shortlists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { "": string }; Returns: string[] };
    };
    Enums: {
      biodata_status: "draft" | "pending_approval" | "approved" | "rejected" | "hidden";
      gender_type: "groom" | "bride";
      marital_status_type: "never_married" | "divorced" | "widowed" | "separated";
      request_status: "pending" | "accepted" | "rejected" | "cancelled";
      user_role: "user" | "moderator" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      biodata_status: ["draft", "pending_approval", "approved", "rejected", "hidden"],
      gender_type: ["groom", "bride"],
      marital_status_type: ["never_married", "divorced", "widowed", "separated"],
      request_status: ["pending", "accepted", "rejected", "cancelled"],
      user_role: ["user", "moderator", "admin"],
    },
  },
} as const;
