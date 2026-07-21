export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activities: {
        Row: {
          actor_id: string | null;
          application_id: string | null;
          body: string | null;
          contact_id: string | null;
          created_at: string;
          id: string;
          is_system: boolean;
          metadata: Json | null;
          type: Database["public"]["Enums"]["activity_type"];
        };
        Insert: {
          actor_id?: string | null;
          application_id?: string | null;
          body?: string | null;
          contact_id?: string | null;
          created_at?: string;
          id?: string;
          is_system?: boolean;
          metadata?: Json | null;
          type: Database["public"]["Enums"]["activity_type"];
        };
        Update: {
          actor_id?: string | null;
          application_id?: string | null;
          body?: string | null;
          contact_id?: string | null;
          created_at?: string;
          id?: string;
          is_system?: boolean;
          metadata?: Json | null;
          type?: Database["public"]["Enums"]["activity_type"];
        };
        Relationships: [
          {
            foreignKeyName: "activities_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      applications: {
        Row: {
          booking_confirmed_at: string | null;
          booking_url: string | null;
          booking_url_sent_at: string | null;
          contact_id: string;
          course_id: string | null;
          created_at: string;
          decision_reason: string | null;
          decision_status: Database["public"]["Enums"]["decision_status"];
          enrolled_at: string | null;
          form_id: string | null;
          id: string;
          is_possible_duplicate: boolean;
          last_reminder_sent_at: string | null;
          message: string | null;
          owner_id: string | null;
          payment_amount: number | null;
          payment_paid_at: string | null;
          payment_sent_at: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          pipeline_stage: Database["public"]["Enums"]["pipeline_stage"];
          qualification_data: Json | null;
          qualification_submitted_at: string | null;
          qualification_token: string | null;
          qualification_token_expires_at: string | null;
          reminder_count: number;
          scheduled_for: string | null;
          updated_at: string;
        };
        Insert: {
          booking_confirmed_at?: string | null;
          booking_url?: string | null;
          booking_url_sent_at?: string | null;
          contact_id: string;
          course_id?: string | null;
          created_at?: string;
          decision_reason?: string | null;
          decision_status?: Database["public"]["Enums"]["decision_status"];
          enrolled_at?: string | null;
          form_id?: string | null;
          id?: string;
          is_possible_duplicate?: boolean;
          last_reminder_sent_at?: string | null;
          message?: string | null;
          owner_id?: string | null;
          payment_amount?: number | null;
          payment_paid_at?: string | null;
          payment_sent_at?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          pipeline_stage?: Database["public"]["Enums"]["pipeline_stage"];
          qualification_data?: Json | null;
          qualification_submitted_at?: string | null;
          qualification_token?: string | null;
          qualification_token_expires_at?: string | null;
          reminder_count?: number;
          scheduled_for?: string | null;
          updated_at?: string;
        };
        Update: {
          booking_confirmed_at?: string | null;
          booking_url?: string | null;
          booking_url_sent_at?: string | null;
          contact_id?: string;
          course_id?: string | null;
          created_at?: string;
          decision_reason?: string | null;
          decision_status?: Database["public"]["Enums"]["decision_status"];
          enrolled_at?: string | null;
          form_id?: string | null;
          id?: string;
          is_possible_duplicate?: boolean;
          last_reminder_sent_at?: string | null;
          message?: string | null;
          owner_id?: string | null;
          payment_amount?: number | null;
          payment_paid_at?: string | null;
          payment_sent_at?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          pipeline_stage?: Database["public"]["Enums"]["pipeline_stage"];
          qualification_data?: Json | null;
          qualification_submitted_at?: string | null;
          qualification_token?: string | null;
          qualification_token_expires_at?: string | null;
          reminder_count?: number;
          scheduled_for?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          after: Json | null;
          before: Json | null;
          created_at: string;
          entity: string;
          entity_id: string | null;
          id: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          after?: Json | null;
          before?: Json | null;
          created_at?: string;
          entity: string;
          entity_id?: string | null;
          id?: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          after?: Json | null;
          before?: Json | null;
          created_at?: string;
          entity?: string;
          entity_id?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      automation_runs: {
        Row: {
          application_id: string | null;
          automation_key: string;
          created_at: string;
          id: string;
          outcome: string;
          payload: Json | null;
        };
        Insert: {
          application_id?: string | null;
          automation_key: string;
          created_at?: string;
          id?: string;
          outcome: string;
          payload?: Json | null;
        };
        Update: {
          application_id?: string | null;
          automation_key?: string;
          created_at?: string;
          id?: string;
          outcome?: string;
          payload?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "automation_runs_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      contacts: {
        Row: {
          country: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          owner_id: string | null;
          phone: string | null;
          source: string | null;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          owner_id?: string | null;
          phone?: string | null;
          source?: string | null;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          owner_id?: string | null;
          phone?: string | null;
          source?: string | null;
          updated_at?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          code: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_templates: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          is_active: boolean;
          key: string;
          name: string;
          subject: string;
          updated_at: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          key: string;
          name: string;
          subject: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          key?: string;
          name?: string;
          subject?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_campaigns: {
        Row: {
          completed_at: string | null;
          created_at: string;
          failed_count: number;
          html: string;
          id: string;
          name: string;
          sent_count: number;
          started_at: string | null;
          status: string;
          subject: string;
          text: string | null;
          total_recipients: number;
          updated_at: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          failed_count?: number;
          html: string;
          id?: string;
          name: string;
          sent_count?: number;
          started_at?: string | null;
          status?: string;
          subject: string;
          text?: string | null;
          total_recipients?: number;
          updated_at?: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          failed_count?: number;
          html?: string;
          id?: string;
          name?: string;
          sent_count?: number;
          started_at?: string | null;
          status?: string;
          subject?: string;
          text?: string | null;
          total_recipients?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_campaign_recipients: {
        Row: {
          campaign_id: string;
          created_at: string;
          error_message: string | null;
          id: string;
          recipient: string;
          sent_at: string | null;
          status: string;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          recipient: string;
          sent_at?: string | null;
          status?: string;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          recipient?: string;
          sent_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "email_campaign_recipients_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "email_campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      emails: {
        Row: {
          application_id: string | null;
          body: string | null;
          contact_id: string | null;
          created_at: string;
          id: string;
          recipient: string;
          sent_by: string | null;
          status: string;
          subject: string;
          template_key: string | null;
        };
        Insert: {
          application_id?: string | null;
          body?: string | null;
          contact_id?: string | null;
          created_at?: string;
          id?: string;
          recipient: string;
          sent_by?: string | null;
          status?: string;
          subject: string;
          template_key?: string | null;
        };
        Update: {
          application_id?: string | null;
          body?: string | null;
          contact_id?: string | null;
          created_at?: string;
          id?: string;
          recipient?: string;
          sent_by?: string | null;
          status?: string;
          subject?: string;
          template_key?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "emails_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "emails_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      forms: {
        Row: {
          course_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          headline: string | null;
          id: string;
          is_active: boolean;
          name: string;
          redirect_url: string | null;
          require_phone: boolean;
          show_country: boolean;
          show_message: boolean;
          show_phone: boolean;
          slug: string;
          submission_count: number;
          success_message: string;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          headline?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          redirect_url?: string | null;
          require_phone?: boolean;
          show_country?: boolean;
          show_message?: boolean;
          show_phone?: boolean;
          slug: string;
          submission_count?: number;
          success_message?: string;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          headline?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          redirect_url?: string | null;
          require_phone?: boolean;
          show_country?: boolean;
          show_message?: boolean;
          show_phone?: boolean;
          slug?: string;
          submission_count?: number;
          success_message?: string;
          updated_at?: string;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "forms_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          link: string | null;
          read_at: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          email: string | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          application_id: string | null;
          assigned_to: string | null;
          completed_at: string | null;
          contact_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          due_date: string | null;
          id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          application_id?: string | null;
          assigned_to?: string | null;
          completed_at?: string | null;
          contact_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          application_id?: string | null;
          assigned_to?: string | null;
          completed_at?: string | null;
          contact_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_staff_member: { Args: { _user_id: string }; Returns: boolean };
    };
    Enums: {
      activity_type:
        | "note"
        | "repeat_enquiry"
        | "email_sent"
        | "reminder_sent"
        | "stage_changed"
        | "decision_set"
        | "payment_marked"
        | "automation_run"
        | "task_created"
        | "task_completed"
        | "meeting_scheduled"
        | "enquiry_received"
        | "qualification_submitted"
        | "booking_confirmed";
      app_role: "admin" | "reviewer" | "staff";
      decision_status: "pending" | "approved" | "on_hold" | "rejected" | "need_more_info";
      payment_status: "not_sent" | "sent" | "paid" | "overdue";
      pipeline_stage:
        | "new_enquiry"
        | "contacted"
        | "awaiting_qualification"
        | "qualification_submitted"
        | "awaiting_interview_booking"
        | "interview_booked"
        | "interview_completed"
        | "awaiting_payment"
        | "enrolled"
        | "dormant";
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      activity_type: [
        "note",
        "repeat_enquiry",
        "email_sent",
        "reminder_sent",
        "stage_changed",
        "decision_set",
        "payment_marked",
        "automation_run",
        "task_created",
        "task_completed",
        "meeting_scheduled",
        "enquiry_received",
        "qualification_submitted",
        "booking_confirmed",
      ],
      app_role: ["admin", "reviewer", "staff"],
      decision_status: ["pending", "approved", "on_hold", "rejected", "need_more_info"],
      payment_status: ["not_sent", "sent", "paid", "overdue"],
      pipeline_stage: [
        "new_enquiry",
        "contacted",
        "awaiting_qualification",
        "qualification_submitted",
        "awaiting_interview_booking",
        "interview_booked",
        "interview_completed",
        "awaiting_payment",
        "enrolled",
        "dormant",
      ],
    },
  },
} as const;
