// @ts-nocheck
import { createServerClient, CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../types';

interface CookieOptions {
  name: string;
  value: string;
  options?: {
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    maxAge?: number;
    domain?: string;
    sameSite?: 'strict' | 'lax' | 'none';
  };
}

// Create server-side client 
export async function createServerComponentClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
        async set(name: string, value: string, options: any) {
          try {
            await cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting error if needed
          }
        },
        async remove(name: string, options: any) {
          try {
            await cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          } catch (error) {
            // Handle cookie removal error if needed
          }
        },
      },
    }
  );
}

// Get the logged-in user from server component
export async function getUser() {
  try {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data?.user) {
      return { 
        user: null,
        error: error || new Error("User not found") 
      };
    }
    
    return { user: data.user };
  } catch (error) {
    console.error("Error in getUser:", error);
    return { user: null, error };
  }
}

// Get user's session from server component
export async function getSession() {
  try {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data?.session) {
      return { 
        session: null,
        error: error || new Error("Session not found") 
      };
    }
    
    return { session: data.session };
  } catch (error) {
    console.error("Error in getSession:", error);
    return { session: null, error };
  }
}

// Check if the current user has access to a restaurant
export async function hasRestaurantAccess(restaurantId: string) {
  if (!restaurantId) return false;
  
  const { user } = await getUser();
  if (!user) return false;
  
  const supabase = await createServerComponentClient();
  
  // Gebruik de nieuwe functie via RPC om RLS recursie te voorkomen
  const { data, error } = await supabase.rpc('check_restaurant_membership', {
    p_user_id: user.id,
    p_restaurant_id: restaurantId
  });
  
  if (error) {
    console.error('Error checking restaurant access:', error);
    return false;
  }
  
  return !!data;
}

// Get restaurants associated with a user (for restaurant app)
export const getUserRestaurants = async () => {
  const supabase = await createServerComponentClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { restaurants: [] };
    }
    
    // Gebruik de SECURITY DEFINER functie om de oneindige recursie in RLS te vermijden
    const { data, error } = await supabase.rpc('get_user_restaurants_data', {
      p_user_id: user.id
    });
    
    if (error) {
      throw error;
    }
    
    // For testing purposes, return a mock restaurant if no data or empty array
    if (!data || data.length === 0) {
      return {
        restaurants: [
          {
            id: 'mock-id',
            name: 'Test Restaurant',
            address: 'Teststraat 123, Amsterdam',
            owner_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'active',
            cuisine: 'italian',
          }
        ]
      };
    }
    
    return { restaurants: data };
  } catch (error) {
    console.error('Error fetching user restaurants:', error);
    return { restaurants: [] };
  }
};

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

export async function getUserRestaurantsById(userId: string): Promise<RestaurantStaff[]> {
  const supabase = await createServerComponentClient();
  
  try {
    // Gebruik de SECURITY DEFINER functie om oneindige recursie in RLS te vermijden
    const { data, error } = await supabase.rpc('get_user_restaurants_by_id', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Error getting user restaurants:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserRestaurants:', error);
    return [];
  }
} 