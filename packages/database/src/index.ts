export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          owner_id: string
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          logo_url: string | null
          banner_url: string | null
          cuisine_type: string | null
          status: string
          average_rating: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          owner_id: string
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          logo_url?: string | null
          banner_url?: string | null
          cuisine_type?: string | null
          status?: string
          average_rating?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          owner_id?: string
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          logo_url?: string | null
          banner_url?: string | null
          cuisine_type?: string | null
          status?: string
          average_rating?: number | null
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string | null
          created_at: string
          updated_at: string
          is_available: boolean
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
          is_available?: boolean
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
          is_available?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          restaurant_id: string
          status: string
          created_at: string
          updated_at: string
          total_amount: number
          delivery_address: string | null
          payment_status: string
          delivery_time: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          restaurant_id: string
          status?: string
          created_at?: string
          updated_at?: string
          total_amount: number
          delivery_address?: string | null
          payment_status?: string
          delivery_time?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          restaurant_id?: string
          status?: string
          created_at?: string
          updated_at?: string
          total_amount?: number
          delivery_address?: string | null
          payment_status?: string
          delivery_time?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 