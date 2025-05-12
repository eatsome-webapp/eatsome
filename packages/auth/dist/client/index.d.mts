import * as _supabase_supabase_js from '@supabase/supabase-js';
import React from 'react';

declare function AuthProvider({ children }: {
    children: React.ReactNode;
}): React.ReactNode;
declare function useAuth(): {
    user: any;
    session: any;
    supabase: _supabase_supabase_js.SupabaseClient<any, "public", any>;
    isLoading: boolean;
    signIn: ({ email, password }: {
        email: string;
        password: string;
    }) => Promise<_supabase_supabase_js.AuthTokenResponsePassword>;
    signUp: ({ email, password }: {
        email: string;
        password: string;
    }) => Promise<_supabase_supabase_js.AuthResponse>;
    signOut: () => Promise<{
        error: _supabase_supabase_js.AuthError | null;
    }>;
    getSession: () => Promise<_supabase_supabase_js.AuthSession | null>;
};
declare function createClient(): _supabase_supabase_js.SupabaseClient<any, "public", any>;

export { AuthProvider, createClient, useAuth };
