'use client';

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

// Fix the type definitions to avoid 'any' and empty object types
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data?: { user: User | null; session: Session | null };
  }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{
    error: Error | null;
    data?: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<{ error: Error | null }>;
};

// Define AuthProvider props type
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    getSession();
  }, [supabase]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn: async (email: string, password: string) => {
      try {
        const result = await supabase.auth.signInWithPassword({ email, password });
        return { error: result.error, data: result.data };
      } catch (error) {
        return { error: error as Error };
      }
    },
    signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
      try {
        const result = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: metadata } 
        });
        return { error: result.error, data: result.data };
      } catch (error) {
        return { error: error as Error };
      }
    },
    signOut: async () => {
      try {
        const result = await supabase.auth.signOut();
        return { error: result.error };
      } catch (error) {
        return { error: error as Error };
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 