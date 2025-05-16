'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import type { Profile } from './types';
import type { UserRole } from './roles';
import { cache } from 'react';

// Create a Supabase client for server components with proper async/await for cookies in Next.js 15.3+
export const getSupabaseServerClient = async (options?: { admin?: boolean }) => {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    options?.admin
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // This can happen when attempting to set cookies in middleware
            // Just silently fail and let the middleware handle it
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            // This can happen when attempting to remove cookies in middleware
            // Just silently fail and let the middleware handle it
          }
        },
      },
    }
  );

  return supabase;
};

// Cached implementation to improve performance for multiple calls within the same render
export const createCachedSupabaseClient = cache(async () => {
  return getSupabaseServerClient();
});

// Get the authenticated user from server
export const getUser = async (): Promise<User | null> => {
  const supabase = await getSupabaseServerClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Get the user's role from the server
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  return data?.role || null;
}

// Get the user's full profile
export const getProfile = async (userId?: string): Promise<Profile | null> => {
  if (!userId) {
    const user = await getUser();
    if (!user) return null;
    userId = user.id;
  }

  const supabase = await getSupabaseServerClient();

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error || !data) return null;
    return data as Profile;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

// Get both the user and their profile in a single request
export const getUserWithProfile = async (): Promise<{ user: User; profile: Profile } | null> => {
  const user = await getUser();
  if (!user) return null;

  const profile = await getProfile(user.id);
  if (!profile) return null;

  return { user, profile };
};

// Check if user has access to specific resource by restaurant_id
export async function hasRestaurantAccess(restaurantId: string): Promise<boolean> {
  const userWithProfile = await getUserWithProfile();

  if (!userWithProfile) {
    return false;
  }

  const { profile } = userWithProfile;

  // Platform admins have access to all restaurants
  if (profile.role === 'platform_admin') {
    return true;
  }

  // Restaurant staff and admins only have access to their own restaurant
  if (['restaurant_staff', 'restaurant_admin'].includes(profile.role)) {
    return profile.restaurant_id === restaurantId;
  }

  return false;
}

// Sign in with PIN code (for staff)
export async function signInWithPin(email: string, pin: string) {
  const supabase = await getSupabaseServerClient();

  // First, we'll try to get the user by email
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, metadata')
    .eq('email', email)
    .single();

  if (profileError || !profileData) {
    return { error: 'Invalid credentials', data: null };
  }

  // Check if the PIN is valid
  const storedPin = profileData.metadata?.pin;
  if (!storedPin || storedPin !== pin) {
    return { error: 'Invalid PIN', data: null };
  }

  // Generate an OTP magic link for the user
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return { data, error };
}

/**
 * Middleware helper for server-side auth
 */
export const updateSession = async (request: NextRequest) => {
  // Create a response using NextResponse
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Refresh the session
  await supabase.auth.getUser();

  return response;
};
