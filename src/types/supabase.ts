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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          doctor_id: string | null
          doctor_name: string | null
          id: string
          notes: string | null
          patient_id: string | null
          reason: string | null
          status: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          doctor_id?: string | null
          doctor_name?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason?: string | null
          status?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          doctor_id?: string | null
          doctor_name?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason?: string | null
          status?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          consultation_id: string | null
          created_at: string | null
          id: string
          message: string
          sender_id: string | null
          sender_type: string | null
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          sender_id?: string | null
          sender_type?: string | null
        }
        Update: {
          consultation_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          sender_id?: string | null
          sender_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          ai_handoff_reason: string | null
          ai_triage_result: Json | null
          chat_transcript: Json | null
          created_at: string | null
          diagnosis: string | null
          doctor_id: string | null
          id: string
          patient_id: string | null
          prescription: string | null
          severity: string | null
          status: string | null
          symptoms: string | null
          updated_at: string | null
          video_call_url: string | null
        }
        Insert: {
          ai_handoff_reason?: string | null
          ai_triage_result?: Json | null
          chat_transcript?: Json | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          patient_id?: string | null
          prescription?: string | null
          severity?: string | null
          status?: string | null
          symptoms?: string | null
          updated_at?: string | null
          video_call_url?: string | null
        }
        Update: {
          ai_handoff_reason?: string | null
          ai_triage_result?: Json | null
          chat_transcript?: Json | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          patient_id?: string | null
          prescription?: string | null
          severity?: string | null
          status?: string | null
          symptoms?: string | null
          updated_at?: string | null
          video_call_url?: string | null
        }
        Relationships: []
      }
      id_sequences: {
        Row: {
          last_value: number
          role_prefix: string
        }
        Insert: {
          last_value?: number
          role_prefix: string
        }
        Update: {
          last_value?: number
          role_prefix?: string
        }
        Relationships: []
      }
      insurance_details: {
        Row: {
          id: number
          is_active: boolean | null
          patient_id: string
          policy_number: string
          provider: string
        }
        Insert: {
          id?: number
          is_active?: boolean | null
          patient_id: string
          policy_number: string
          provider: string
        }
        Update: {
          id?: number
          is_active?: boolean | null
          patient_id?: string
          policy_number?: string
          provider?: string
        }
        Relationships: []
      }
      medical_documents: {
        Row: {
          document_name: string
          document_url: string
          id: number
          patient_id: string
          uploaded_at: string | null
        }
        Insert: {
          document_name: string
          document_url: string
          id?: number
          patient_id: string
          uploaded_at?: string | null
        }
        Update: {
          document_name?: string
          document_url?: string
          id?: number
          patient_id?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          created_at: string
          file_url: string | null
          id: number
          record_date: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: number
          record_date: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: number
          record_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_address: string | null
          delivery_rider_id: string | null
          delivery_type: string | null
          id: string
          patient_id: string | null
          prescription_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_address?: string | null
          delivery_rider_id?: string | null
          delivery_type?: string | null
          id?: string
          patient_id?: string | null
          prescription_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_address?: string | null
          delivery_rider_id?: string | null
          delivery_type?: string | null
          id?: string
          patient_id?: string | null
          prescription_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          consultation_id: string | null
          created_at: string | null
          doctor_id: string | null
          id: string
          medication_list: Json
          notes: string | null
          patient_id: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          medication_list: Json
          notes?: string | null
          patient_id?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          consultation_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          medication_list?: Json
          notes?: string | null
          patient_id?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          email: string
          full_name: string | null
          id: string
          license_number: string | null
          location: string | null
          pharmacy_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          specialization: string | null
          updated_at: string | null
          user_id: string
          vehicle_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          email: string
          full_name?: string | null
          id?: string
          license_number?: string | null
          location?: string | null
          pharmacy_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          email?: string
          full_name?: string | null
          id?: string
          license_number?: string | null
          location?: string | null
          pharmacy_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          features: Json
          id: number
          name: string
          period: string
          popular: boolean | null
          price: number
          users: string
        }
        Insert: {
          features: Json
          id?: never
          name: string
          period: string
          popular?: boolean | null
          price: number
          users: string
        }
        Update: {
          features?: Json
          id?: never
          name?: string
          period?: string
          popular?: boolean | null
          price?: number
          users?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          active: boolean
          end_date: string | null
          id: number
          plan_id: number
          start_date: string
          user_id: string
        }
        Insert: {
          active?: boolean
          end_date?: string | null
          id?: never
          plan_id: number
          start_date?: string
          user_id: string
        }
        Update: {
          active?: boolean
          end_date?: string | null
          id?: never
          plan_id?: number
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      vitals: {
        Row: {
          blood_pressure: string | null
          created_at: string | null
          id: string
          patient_id: string | null
          recorded_by: string | null
          spo2: number | null
          temperature: number | null
        }
        Insert: {
          blood_pressure?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          recorded_by?: string | null
          spo2?: number | null
          temperature?: number | null
        }
        Update: {
          blood_pressure?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          recorded_by?: string | null
          spo2?: number | null
          temperature?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_doctor_by_specialty: {
        Args: { consultation_id: string; required_specialty: string }
        Returns: string
      }
      generate_custom_id: { Args: { p_role_prefix: string }; Returns: string }
      get_doctor_specializations: { Args: never; Returns: string[] }
      get_doctors: {
        Args: never
        Returns: {
          full_name: string
          id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "doctor"
        | "kiosk_partner"
        | "patient"
        | "vendor"
        | "delivery_rider"
      doctor_specialization:
        | "Cardiology"
        | "Dermatology"
        | "Endocrinology"
        | "Gastroenterology"
        | "General Practice"
        | "Neurology"
        | "Oncology"
        | "Pediatrics"
        | "Psychiatry"
        | "Urology"
        | "Obstetrics and Gynecology"
        | "Ophthalmology"
        | "Orthopedics"
        | "Otolaryngology (ENT)"
        | "Pulmonology"
        | "Nephrology"
        | "Rheumatology"
        | "Anesthesiology"
        | "Radiology"
        | "Emergency Medicine"
      user_role:
        | "patient"
        | "doctor"
        | "vendor"
        | "delivery_rider"
        | "kiosk_partner"
        | "admin"
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
      app_role: [
        "admin",
        "doctor",
        "kiosk_partner",
        "patient",
        "vendor",
        "delivery_rider",
      ],
      doctor_specialization: [
        "Cardiology",
        "Dermatology",
        "Endocrinology",
        "Gastroenterology",
        "General Practice",
        "Neurology",
        "Oncology",
        "Pediatrics",
        "Psychiatry",
        "Urology",
        "Obstetrics and Gynecology",
        "Ophthalmology",
        "Orthopedics",
        "Otolaryngology (ENT)",
        "Pulmonology",
        "Nephrology",
        "Rheumatology",
        "Anesthesiology",
        "Radiology",
        "Emergency Medicine",
      ],
      user_role: [
        "patient",
        "doctor",
        "vendor",
        "delivery_rider",
        "kiosk_partner",
        "admin",
      ],
    },
  },
} as const
