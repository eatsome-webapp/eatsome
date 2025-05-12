"use client";

// src/client/index.ts
import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
function AuthProvider({ children }) {
  return children;
}
function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  useEffect(() => {
    const getSession2 = async () => {
      setIsLoading(true);
      const { data: { session: sessionData } } = await supabase.auth.getSession();
      if (sessionData) {
        const { data: { user: userData } } = await supabase.auth.getUser();
        setUser(userData);
        setSession(sessionData);
      }
      setIsLoading(false);
    };
    getSession2();
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
  const signIn = async ({ email, password }) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };
  const signUp = async ({ email, password }) => {
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
function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
export {
  AuthProvider,
  createClient,
  useAuth
};
//# sourceMappingURL=index.mjs.map