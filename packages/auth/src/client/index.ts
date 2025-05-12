'use client';

import { createBrowserClient } from '@supabase/ssr';
import React, { useState, useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const supabase = createClient();
  
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session: sessionData } } = await supabase.auth.getSession();
      
      if (sessionData) {
        const { data: { user: userData } } = await supabase.auth.getUser();
        setUser(userData);
        setSession(sessionData);
      }
      
      setIsLoading(false);
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    return await supabase.auth.signInWithPassword({ 
      email,
      password
    });
  };
  
  const signUp = async ({ email, password }: { email: string; password: string }) => {
    return await supabase.auth.signUp({
      email,
      password
    });
  };
  
  const signOut = async () => {
    return await supabase.auth.signOut();
  };
  
  const getSession = async () => {
    const { data: { session: sessionData } } = await supabase.auth.getSession();
    return sessionData;
  };
  
  return {
    user,
    session,
    supabase,
    isLoading,
    signIn,
    signUp,
    signOut,
    getSession
  };
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}