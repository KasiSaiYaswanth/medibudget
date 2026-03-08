export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      cost_estimation_logs: {
        Row: {
          city: string | null
          condition: string
          created_at: string
          estimated_cost: number
          hospital_type: string | null
          id: string
          insurance_applied: boolean | null
          insurance_coverage: number | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          condition: string
          created_at?: string
          estimated_cost: number
          hospital_type?: string | null
          id?: string
          insurance_applied?: boolean | null
          insurance_coverage?: number | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          condition?: string
          created_at?: string
          estimated_cost?: number
          hospital_type?: string | null
          id?: string
          insurance_applied?: boolean | null
          insurance_coverage?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      government_schemes: {
        Row: {
          coverage_amount: number | null
          created_at: string
          description: string | null
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          name: string
          state: string | null
          updated_at: string
        }
        Insert: {
          coverage_amount?: number | null
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          coverage_amount?: number | null
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          category: string
          city: string
          consultation_cost: number | null
          contact_phone: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          pricing_tier: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          city: string
          consultation_cost?: number | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          pricing_tier?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string
          consultation_cost?: number | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          pricing_tier?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      insurance_providers: {
        Row: {
          claim_limit: number | null
          coverage_percentage: number | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          plan_types: string[] | null
        }
        Insert: {
          claim_limit?: number | null
          coverage_percentage?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          plan_types?: string[] | null
        }
        Update: {
          claim_limit?: number | null
          coverage_percentage?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          plan_types?: string[] | null
        }
        Relationships: []
      }
      medicines: {
        Row: {
          category: string
          created_at: string
          dosage: string
          generic_name: string
          id: string
          name: string
          prescription_required: boolean
          price_range: string
          side_effects: string[]
          uses: string[]
          warnings: string[]
        }
        Insert: {
          category: string
          created_at?: string
          dosage: string
          generic_name: string
          id?: string
          name: string
          prescription_required?: boolean
          price_range: string
          side_effects?: string[]
          uses?: string[]
          warnings?: string[]
        }
        Update: {
          category?: string
          created_at?: string
          dosage?: string
          generic_name?: string
          id?: string
          name?: string
          prescription_required?: boolean
          price_range?: string
          side_effects?: string[]
          uses?: string[]
          warnings?: string[]
        }
        Relationships: []
      }
      symptom_searches: {
        Row: {
          city: string | null
          confidence_score: number | null
          created_at: string
          id: string
          predicted_condition: string | null
          symptom: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          predicted_condition?: string | null
          symptom: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          predicted_condition?: string | null
          symptom?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
