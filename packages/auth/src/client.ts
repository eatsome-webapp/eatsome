'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Role } from './types/roles';

/**
 * Creates a Supabase client for client components
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Signs in a user with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({
    email,
    password
  });
}

/**
 * Signs in a staff member with PIN code
 * This would require a custom implementation with Supabase functions
 */
export async function signInWithPIN(restaurantId: string, pin: string) {
  const supabase = createClient();
  
  // This is a placeholder implementation
  // In a real app, you would call a Supabase Function or an API endpoint
  // that verifies the PIN against a hashed value in the database
  const { data, error } = await supabase
    .from('staff_pins')
    .select('user_id, role')
    .match({ restaurant_id: restaurantId, pin_hash: pin })
    .single();
  
  if (error || !data) {
    throw new Error('Invalid PIN');
  }
  
  // Once the PIN is verified, sign in the user with a custom token or session
  return {
    user: {
      id: data.user_id,
      role: data.role as Role
    }
  };
}

/**
 * Signs out the current user
 */
export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}