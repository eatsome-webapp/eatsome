import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Role } from './types/roles';

/**
 * Creates a Supabase client for server components
 */
export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle errors in Server Components
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle errors in Server Components
          }
        },
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          } catch (error) {
            // Handle errors in Server Components
          }
        },
      },
    }
  );
}

/**
 * Gets the current user with caching
 * Always use this instead of getSession() in server components
 */
export const getUser = cache(async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
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