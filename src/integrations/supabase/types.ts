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
    PostgrestVersion: "13.0.5"
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
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
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
          ai_triage_result: Json | null
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
        }
        Insert: {
          ai_triage_result?: Json | null
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
        }
        Update: {
          ai_triage_result?: Json | null
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
        }
        Relationships: [
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_riders: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          license_number: string | null
          phone: string | null
          specialization: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          license_number?: string | null
          phone?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          license_number?: string | null
          phone?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      kiosk_partners: {
        Row: {
          business_name: string
          created_at: string | null
          id: string
          location: string
          owner_name: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_name: string
          created_at?: string | null
          id?: string
          location: string
          owner_name: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string | null
          id?: string
          location?: string
          owner_name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
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
            foreignKeyName: "orders_delivery_rider_id_fkey"
            columns: ["delivery_rider_id"]
            isOneToOne: false
            referencedRelation: "delivery_riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number | null
          condition: string | null
          created_at: string | null
          full_name: string
          id: string
          last_visit: string | null
          location: string | null
          medical_history: string | null
          phone: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          condition?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          last_visit?: string | null
          location?: string | null
          medical_history?: string | null
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          condition?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          last_visit?: string | null
          location?: string | null
          medical_history?: string | null
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          medical_history: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          medical_history?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          medical_history?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          created_at: string | null
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          owner_name: string
          pharmacy_name: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          owner_name: string
          pharmacy_name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          owner_name?: string
          pharmacy_name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "vitals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
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
      app_role:
        | "admin"
        | "doctor"
        | "kiosk_partner"
        | "patient"
        | "vendor"
        | "delivery_rider"
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
    },
  },
} as const
