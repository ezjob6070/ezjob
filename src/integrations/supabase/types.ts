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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          initials: string | null
          last_contact_at: string | null
          name: string
          notes: string | null
          payment_amount: number | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          initials?: string | null
          last_contact_at?: string | null
          name: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          initials?: string | null
          last_contact_at?: string | null
          name?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Relationships: []
      }
      job_sources: {
        Row: {
          contact_person: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          payment_type: Database["public"]["Enums"]["commission_type"]
          payment_value: number
          phone: string | null
          type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          payment_type?: Database["public"]["Enums"]["commission_type"]
          payment_value?: number
          phone?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          payment_type?: Database["public"]["Enums"]["commission_type"]
          payment_value?: number
          phone?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          actual_amount: number | null
          address: string | null
          amount: number
          cancellation_reason: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          company_profit: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          job_number: string | null
          job_source_id: string | null
          job_source_payout: number
          notes: string | null
          payment_method: string | null
          payment_status:
            | Database["public"]["Enums"]["job_payment_status"]
            | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["job_status"]
          technician_id: string | null
          technician_payout: number
          title: string
          updated_at: string
        }
        Insert: {
          actual_amount?: number | null
          address?: string | null
          amount?: number
          cancellation_reason?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          company_profit?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          job_number?: string | null
          job_source_id?: string | null
          job_source_payout?: number
          notes?: string | null
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["job_payment_status"]
            | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          technician_payout?: number
          title: string
          updated_at?: string
        }
        Update: {
          actual_amount?: number | null
          address?: string | null
          amount?: number
          cancellation_reason?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          company_profit?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          job_number?: string | null
          job_source_id?: string | null
          job_source_payout?: number
          notes?: string | null
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["job_payment_status"]
            | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          technician_payout?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_job_source_id_fkey"
            columns: ["job_source_id"]
            isOneToOne: false
            referencedRelation: "job_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          date_added: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          service: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          value: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          date_added?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          service?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          value?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          date_added?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          service?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      technicians: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          hire_date: string | null
          hourly_rate: number | null
          id: string
          name: string
          notes: string | null
          payment_rate: number
          payment_type: Database["public"]["Enums"]["payment_type"]
          phone: string | null
          profile_image: string | null
          role: Database["public"]["Enums"]["technician_role"]
          specialty: string | null
          status: Database["public"]["Enums"]["technician_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          name: string
          notes?: string | null
          payment_rate?: number
          payment_type?: Database["public"]["Enums"]["payment_type"]
          phone?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["technician_role"]
          specialty?: string | null
          status?: Database["public"]["Enums"]["technician_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          name?: string
          notes?: string | null
          payment_rate?: number
          payment_type?: Database["public"]["Enums"]["payment_type"]
          phone?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["technician_role"]
          specialty?: string | null
          status?: Database["public"]["Enums"]["technician_status"]
          updated_at?: string
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
      app_role: "admin" | "manager" | "technician" | "employee"
      client_status: "active" | "inactive" | "lead"
      commission_type: "percentage" | "fixed"
      job_payment_status: "unpaid" | "partial" | "paid"
      job_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rescheduled"
      lead_status: "active" | "converted" | "inactive"
      payment_status: "current" | "pending" | "overdue"
      payment_type: "percentage" | "flat" | "hourly" | "salary"
      technician_role: "technician" | "contractor" | "employee"
      technician_status: "active" | "inactive" | "on_leave"
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
      app_role: ["admin", "manager", "technician", "employee"],
      client_status: ["active", "inactive", "lead"],
      commission_type: ["percentage", "fixed"],
      job_payment_status: ["unpaid", "partial", "paid"],
      job_status: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      lead_status: ["active", "converted", "inactive"],
      payment_status: ["current", "pending", "overdue"],
      payment_type: ["percentage", "flat", "hourly", "salary"],
      technician_role: ["technician", "contractor", "employee"],
      technician_status: ["active", "inactive", "on_leave"],
    },
  },
} as const
