'use server';

import { createClient } from './server';
import { redirect } from 'next/navigation';

/**
 * Signs out the current user and redirects to the login page
 */
export async function signOut(redirectTo: string = '/') {
  const supabase = await createClient();
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Redirect to the provided redirect path or default
  redirect(redirectTo);
}

/**
 * Handles user login with email/password
 * Works for both staff and admin users
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
} 