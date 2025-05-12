import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Create a cached client to avoid creating a new client on every request
export const createClient = cache(async () => {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
});

export async function getUser() {
  const supabase = await createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error in getUser:', error);
    return null;
  }
}

export async function getSession() {
  const supabase = await createClient();
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
}

export async function getUserRestaurants(userId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('restaurant_staff')
      .select(`
        restaurant_id,
        role,
        restaurants:restaurant_id (
          id,
          name,
          description,
          address
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error getting user restaurants:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserRestaurants:', error);
    return [];
  }
} 