'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, SupabaseClient, AuthError } from '@supabase/supabase-js';
import type { Profile, UserWithProfile } from '../utils/types';
import type { UserRole } from '../utils/roles';
import { ROLE_HIERARCHY } from '../utils/roles';

interface AuthContextProps {
  user: UserWithProfile | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;

  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signInWithOtp: (email: string) => Promise<{ error?: AuthError }>;
  signInWithPin: (email: string, pin: string) => Promise<{ error?: AuthError }>;
  signUp: (
    email: string,
    password: string,
    userData?: Partial<Profile>
  ) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updatePassword: (password: string) => Promise<{ error?: AuthError }>;
  refreshUser: () => Promise<void>;

  // Role checks
  hasRole: (role: UserRole) => boolean;
  hasRequiredRole: (requiredRole: UserRole) => boolean;

  // Profile updates
  updateProfile: (data: Partial<Profile>) => Promise<{ error?: Error | null }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  supabase: SupabaseClient;
  serverUser?: User | null;
  serverProfile?: Profile | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  supabase,
  serverUser = null,
  serverProfile = null,
}) => {
  const [user, setUser] = useState<UserWithProfile | null>(
    serverUser ? { ...serverUser, profile: serverProfile } : null
  );
  const [profile, setProfile] = useState<Profile | null>(serverProfile);
  const [isLoading, setIsLoading] = useState<boolean>(!serverUser);
  const role = profile?.role || null;

  const getUserProfile = async (userId: string) => {
    try {
      // Validate userId before making the query
      if (!userId || userId.trim() === '') {
        console.error('Invalid user ID provided:', userId);
        return null;
      }

      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) {
        console.error(
          'Supabase error fetching user profile:',
          error ? JSON.stringify(error) : 'unknown error'
        );
        // Log more details if this is a PostgreSQL error
        if (error && error.code === '22P02') {
          console.error('Invalid UUID format for user ID:', userId);
        }
        return null; // Return null instead of throwing to prevent unhandled rejection
      }

      if (!data) {
        console.error('No profile found for user ID:', userId);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error(
        'Error fetching user profile:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return null;
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user: freshUser },
      } = await supabase.auth.getUser();

      if (!freshUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      const freshProfile = await getUserProfile(freshUser.id);
      setUser({ ...freshUser, profile: freshProfile });
      setProfile(freshProfile);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!serverUser) {
      refreshUser();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      if (session?.user) {
        try {
          const profile = await getUserProfile(session.user.id);
          setUser({ ...session.user, profile });
          setProfile(profile);
        } catch (error) {
          console.error(
            'Error in auth state change handler:',
            error instanceof Error ? error.message : 'Unknown error'
          );
          // Still set the user even if profile fetch fails
          setUser(session.user);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, serverUser]);

  // Standard email/password login
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Magic link login (passwordless)
  const signInWithOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) return { error };
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // PIN-based login for staff
  const signInWithPin = async (email: string, pin: string) => {
    try {
      // First verify that the email exists and has a PIN
      const { data: emailCheck, error: emailError } = await supabase
        .from('profiles')
        .select('id, metadata')
        .eq('email', email)
        .single();

      if (emailError || !emailCheck) {
        return { error: { name: 'AuthError', message: 'Invalid credentials' } as AuthError };
      }

      // Validate PIN against stored PIN in profile metadata
      // This should use secure hashing in production
      if (emailCheck.metadata?.pin !== pin) {
        return { error: { name: 'AuthError', message: 'Invalid PIN' } as AuthError };
      }

      // PIN is valid, create an OTP for passwordless login
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) return { error };
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // User registration
  const signUp = async (email: string, password: string, userData?: Partial<Profile>) => {
    try {
      // Default role is 'customer' unless specified
      const role = userData?.role || 'customer';

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            ...userData,
            role,
          },
        },
      });

      if (error) return { error };
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Password reset request
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) return { error };
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Update password after reset
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) return { error };
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Logout the user
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Role checking utilities
  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const hasRequiredRole = (requiredRole: UserRole): boolean => {
    if (!profile?.role) return false;
    return ROLE_HIERARCHY[profile.role].includes(requiredRole);
  };

  // Profile update
  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // Prevent users from updating their role unless they are an admin
      if (data.role && profile?.role !== 'platform_admin') {
        delete data.role;
      }

      // Update profile
      const { error } = await supabase.from('profiles').update(data).eq('id', user.id);

      if (error) throw error;

      // Update local state
      const updatedProfile = { ...profile, ...data } as Profile;
      setProfile(updatedProfile);
      setUser({ ...user, profile: updatedProfile });

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        signIn,
        signInWithOtp,
        signInWithPin,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshUser,
        hasRole,
        hasRequiredRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
