import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { Role, ROLE_COOKIES, ROLE_REDIRECT_URLS, hasAccessToRole } from '../types/roles';
import type { Database } from '@repo/database';

// Create a Supabase client for server-side authentication
export function createAuthClient() {
  const cookieStore = cookies();
  
  return createServerClient<Database>(
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
          } catch {
            // Handle errors in Server Components
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
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
          } catch {
            // Handle errors in Server Components
          }
        },
      },
    }
  );
}

/**
 * Comprehensive authentication check function
 * This checks if the user is authenticated and has the required role
 * It also fetches additional role-specific information
 */
export async function checkAuth(requiredRole: Role, redirectUrl?: string) {
  const supabase = createAuthClient();
  const cookieStore = cookies();
  
  try {
    // ALWAYS use getUser() in server code for secure authentication
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      redirect(redirectUrl || ROLE_REDIRECT_URLS[requiredRole]);
    }
    
    // Check session cookies to validate role
    let userRole: Role | null = null;
    
    // Look for role cookies (from highest to lowest privilege)
    if (cookieStore.has(ROLE_COOKIES[Role.PLATFORM_ADMIN])) {
      userRole = Role.PLATFORM_ADMIN;
    } else if (cookieStore.has(ROLE_COOKIES[Role.RESTAURANT_ADMIN])) {
      userRole = Role.RESTAURANT_ADMIN;
    } else if (cookieStore.has(ROLE_COOKIES[Role.RESTAURANT_STAFF])) {
      userRole = Role.RESTAURANT_STAFF;
    } else if (cookieStore.has(ROLE_COOKIES[Role.COURIER])) {
      userRole = Role.COURIER;
    } else if (cookieStore.has(ROLE_COOKIES[Role.CUSTOMER])) {
      userRole = Role.CUSTOMER;
    }
    
    // If no role cookie found, try to get the role from the database
    if (!userRole) {
      // Get user profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role) {
        userRole = profile.role as Role;
        
        // Set the corresponding cookie
        if (ROLE_COOKIES[userRole]) {
          cookieStore.set({
            name: ROLE_COOKIES[userRole],
            value: 'true',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        }
      }
    }
    
    // If still no role found, use customer as default
    if (!userRole) {
      userRole = Role.CUSTOMER;
    }
    
    // Check if the user has access to the required role
    if (!hasAccessToRole(userRole, requiredRole)) {
      // User doesn't have access to this role, redirect to the login for that role
      redirect(redirectUrl || ROLE_REDIRECT_URLS[requiredRole]);
    }
    
    // Fetch additional information depending on the role
    let additionalInfo = {};
    
    switch(requiredRole) {
      case Role.RESTAURANT_STAFF:
        const { data: staffMember } = await supabase
          .from('staff_members')
          .select('*, restaurants(*)')
          .eq('user_id', user.id)
          .single();
        additionalInfo = { staffMember, restaurant: staffMember?.restaurants };
        break;
        
      case Role.RESTAURANT_ADMIN:
        const { data: adminProfile } = await supabase
          .from('restaurant_admins')
          .select('*, restaurants(*)')
          .eq('user_id', user.id)
          .single();
        additionalInfo = { adminProfile, restaurant: adminProfile?.restaurants };
        break;
        
      case Role.COURIER:
        const { data: courierProfile } = await supabase
          .from('couriers')
          .select('*')
          .eq('user_id', user.id)
          .single();
        additionalInfo = { courierProfile };
        break;
        
      case Role.PLATFORM_ADMIN:
        const { data: platformProfile } = await supabase
          .from('platform_admins')
          .select('*')
          .eq('user_id', user.id)
          .single();
        additionalInfo = { platformProfile };
        break;
    }
    
    return {
      user,
      role: userRole,
      ...additionalInfo
    };
  } catch (error) {
    console.error('Error checking authentication:', error);
    redirect(redirectUrl || ROLE_REDIRECT_URLS[requiredRole]);
  }
} 