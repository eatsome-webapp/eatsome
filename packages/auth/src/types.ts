import { User, Session } from '@supabase/supabase-js';

export type { User, Session };

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface UserContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<{ error: Error | null }>;
}

export interface RestaurantUserRoles {
  owner: boolean;
  manager: boolean;
  staff: boolean;
  kitchen: boolean;
}

export interface RestaurantUser {
  restaurantId: string;
  userId: string;
  role: 'owner' | 'manager' | 'staff' | 'kitchen';
}

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
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      restaurant_staff: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}