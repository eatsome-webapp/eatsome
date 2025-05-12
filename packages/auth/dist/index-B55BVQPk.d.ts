import * as _supabase_supabase_js from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';

interface AuthProviderProps {
    children: React.ReactNode;
}
interface UserContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{
        error: Error | null;
        data: {
            user: User | null;
            session: Session | null;
        };
    }>;
    signUp: (email: string, password: string, metadata?: {
        [key: string]: any;
    }) => Promise<{
        error: Error | null;
        data: {
            user: User | null;
            session: Session | null;
        };
    }>;
    signOut: () => Promise<{
        error: Error | null;
    }>;
}
interface RestaurantUserRoles {
    owner: boolean;
    manager: boolean;
    staff: boolean;
    kitchen: boolean;
}
interface RestaurantUser {
    restaurantId: string;
    userId: string;
    role: 'owner' | 'manager' | 'staff' | 'kitchen';
}
type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
interface Database {
    public: {
        Tables: {
            restaurants: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    address: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    address: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    address?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            restaurant_staff: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    user_id: string;
                    role: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    restaurant_id: string;
                    user_id: string;
                    role: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    restaurant_id?: string;
                    user_id?: string;
                    role?: string;
                    created_at?: string;
                };
            };
            profiles: {
                Row: {
                    id: string;
                    user_id: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}

declare function createServerComponentClient(): Promise<_supabase_supabase_js.SupabaseClient<Database, "public", any>>;
declare function getUser(): Promise<{
    user: _supabase_supabase_js.AuthUser;
    error?: undefined;
} | {
    user: null;
    error: unknown;
}>;
declare function getSession(): Promise<{
    session: _supabase_supabase_js.AuthSession;
    error?: undefined;
} | {
    session: null;
    error: unknown;
}>;
declare function hasRestaurantAccess(restaurantId: string): Promise<boolean>;
declare const getUserRestaurants: () => Promise<{
    restaurants: any;
}>;
interface RestaurantStaff {
    restaurant_id: string;
    role: string;
    restaurants: {
        id: string;
        name: string;
        description: string | null;
        address: string;
    };
}
declare function getUserRestaurantsById(userId: string): Promise<RestaurantStaff[]>;

export { type AuthProviderProps as A, type Database as D, type Json as J, type RestaurantUserRoles as R, type UserContextType as U, type RestaurantUser as a, getSession as b, createServerComponentClient as c, getUserRestaurants as d, getUserRestaurantsById as e, getUser as g, hasRestaurantAccess as h };
