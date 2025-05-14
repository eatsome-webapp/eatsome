'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { Role, ROLE_COOKIES } from './types/roles';

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
 * Hook for user authentication
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  useEffect(() => {
    // Check authentication status
    const getUser = async () => {
      setLoading(true);
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (user) {
          setUser(user);
          
          // Determine role from cookies or metadata
          const userRole = determineUserRole(user);
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Determine role from cookies or metadata
          const userRole = determineUserRole(session.user);
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  
  return { user, role, loading };
}

/**
 * Signs in a user with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  // Set the role cookie based on user role
  if (data?.user) {
    const role = determineUserRole(data.user);
    if (role) {
      document.cookie = `${ROLE_COOKIES[role]}=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
  }
  
  return data;
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
  
  // Clear all role cookies
  Object.values(ROLE_COOKIES).forEach(cookieName => {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  });
  
  return await supabase.auth.signOut();
}

// Helper function to determine user role
function determineUserRole(user: any): Role {
  // First check user metadata
  const metadataRole = user?.user_metadata?.role as Role;
  if (metadataRole && Object.values(Role).includes(metadataRole)) {
    return metadataRole;
  }
  
  // Check cookies from highest to lowest privilege
  if (document.cookie.includes(`${ROLE_COOKIES[Role.PLATFORM_ADMIN]}=true`)) {
    return Role.PLATFORM_ADMIN;
  } else if (document.cookie.includes(`${ROLE_COOKIES[Role.RESTAURANT_ADMIN]}=true`)) {
    return Role.RESTAURANT_ADMIN;
  } else if (document.cookie.includes(`${ROLE_COOKIES[Role.RESTAURANT_STAFF]}=true`)) {
    return Role.RESTAURANT_STAFF;
  } else if (document.cookie.includes(`${ROLE_COOKIES[Role.COURIER]}=true`)) {
    return Role.COURIER;
  } else if (document.cookie.includes(`${ROLE_COOKIES[Role.CUSTOMER]}=true`)) {
    return Role.CUSTOMER;
  }
  
  // Default to customer
  return Role.CUSTOMER;
}