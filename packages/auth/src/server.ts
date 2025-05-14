'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Role } from './types/roles';

/**
 * Creates a Supabase client for server components
 */
export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value);
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete(name);
        }
      }
    }
  );
}

/**
 * Gets the current user data from Supabase Auth
 * Uses React cache to prevent multiple calls to Supabase in the same render
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  
  // Always use getUser() instead of getSession() for reliable validation
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
});

/**
 * Gets the user role from user metadata
 * Returns null if the user is not authenticated
 */
export const getUserRole = cache(async () => {
  const user = await getUser();
  if (!user) return null;
  
  return user.user_metadata.role as Role || null;
});

/**
 * Verifies if the current user has a specific role
 */
export const hasRole = cache(async (role: Role) => {
  const user = await getUser();
  if (!user) return false;
  
  // In a real app, you would fetch the user's role from Supabase
  // This is a placeholder implementation
  const userRole = user.user_metadata.role as Role;
  
  return userRole === role;
});

/**
 * Verifies if the current user has access to a specific restaurant
 */
export const hasRestaurantAccess = cache(async (restaurantId: string) => {
  const user = await getUser();
  if (!user) return false;
  
  // In a real app, you would verify restaurant access from Supabase
  // This is a placeholder implementation
  const accessibleRestaurants = user.user_metadata.restaurants || [];
  
  return accessibleRestaurants.includes(restaurantId);
}); 