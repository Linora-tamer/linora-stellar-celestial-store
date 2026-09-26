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
      addresses: {
        Row: {
          address: string
          alt_phone: string | null
          city: string
          created_at: string
          full_name: string
          governorate: string | null
          id: string
          is_default: boolean
          label: string | null
          phone: string
          postal_code: string | null
          user_id: string
        }
        Insert: {
          address: string
          alt_phone?: string | null
          city: string
          created_at?: string
          full_name: string
          governorate?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          phone: string
          postal_code?: string | null
          user_id: string
        }
        Update: {
          address?: string
          alt_phone?: string | null
          city?: string
          created_at?: string
          full_name?: string
          governorate?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          phone?: string
          postal_code?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          id: string
          name: string
          name_ar: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          name: string
          name_ar?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      custom_orders: {
        Row: {
          budget: string | null
          created_at: string
          deadline: string | null
          description: string
          design_type: string
          email: string
          id: string
          name: string
          phone: string
          preferred_colors: string | null
          preferred_style: string | null
          reference_url: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          design_type: string
          email: string
          id?: string
          name: string
          phone: string
          preferred_colors?: string | null
          preferred_style?: string | null
          reference_url?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          design_type?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          preferred_colors?: string | null
          preferred_style?: string | null
          reference_url?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          alt_phone: string | null
          city: string
          created_at: string
          customer_name: string
          email: string
          governorate: string | null
          id: string
          items: Json
          national_id: string | null
          notes: string | null
          order_number: string
          payment_method: string
          payment_reference: string | null
          phone: string
          postal_code: string | null
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          address: string
          alt_phone?: string | null
          city: string
          created_at?: string
          customer_name: string
          email: string
          governorate?: string | null
          id?: string
          items?: Json
          national_id?: string | null
          notes?: string | null
          order_number?: string
          payment_method: string
          payment_reference?: string | null
          phone: string
          postal_code?: string | null
          status?: string
          total?: number
          user_id?: string | null
        }
        Update: {
          address?: string
          alt_phone?: string | null
          city?: string
          created_at?: string
          customer_name?: string
          email?: string
          governorate?: string | null
          id?: string
          items?: Json
          national_id?: string | null
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_reference?: string | null
          phone?: string
          postal_code?: string | null
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_number: string | null
          code: string
          id: string
          instructions: string | null
          is_active: boolean
          label: string
          sort_order: number
        }
        Insert: {
          account_number?: string | null
          code: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          label: string
          sort_order?: number
        }
        Update: {
          account_number?: string | null
          code?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      portfolio_categories: {
        Row: {
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          description_ar: string | null
          external_url: string | null
          gallery: Json
          id: string
          is_featured: boolean
          is_published: boolean
          slug: string
          sort_order: number
          summary: string | null
          summary_ar: string | null
          title: string
          title_ar: string | null
        }
        Insert: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          external_url?: string | null
          gallery?: Json
          id?: string
          is_featured?: boolean
          is_published?: boolean
          slug: string
          sort_order?: number
          summary?: string | null
          summary_ar?: string | null
          title: string
          title_ar?: string | null
        }
        Update: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          external_url?: string | null
          gallery?: Json
          id?: string
          is_featured?: boolean
          is_published?: boolean
          slug?: string
          sort_order?: number
          summary?: string | null
          summary_ar?: string | null
          title?: string
          title_ar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "portfolio_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          currency: string
          customizable: boolean
          description: string | null
          description_ar: string | null
          details: Json
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          name_ar: string | null
          price: number
          slug: string
          sort_order: number
          tagline: string | null
          tagline_ar: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          currency?: string
          customizable?: boolean
          description?: string | null
          description_ar?: string | null
          details?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          name_ar?: string | null
          price?: number
          slug: string
          sort_order?: number
          tagline?: string | null
          tagline_ar?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          currency?: string
          customizable?: boolean
          description?: string | null
          description_ar?: string | null
          details?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          name_ar?: string | null
          price?: number
          slug?: string
          sort_order?: number
          tagline?: string | null
          tagline_ar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: string | null
        }
        Insert: {
          key: string
          value?: string | null
        }
        Update: {
          key?: string
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "owner" | "customer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["owner", "customer"],
    },
  },
} as const
