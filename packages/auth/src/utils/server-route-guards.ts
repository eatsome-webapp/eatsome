import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { UserRole } from './roles';
import { hasRequiredRole, APP_ACCESS } from './roles';
import type { User } from '@supabase/supabase-js';
import type { Profile } from './types';
import { cache } from 'react';

interface ServerUserResult {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
}

// Cached implementation of getServerUser to improve performance
export const getServerUser = cache(async (appName: string): Promise<ServerUserResult> => {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        async set() {
          // Server components cannot set cookies
        },
        async remove() {
          // Server components cannot remove cookies
        },
      },
    }
  );

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null, role: null };
    }

    // Fetch the user's profile including their role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { user, profile: null, role: null };
    }

    // Check if user has access to the specified app
    if (appName && profile?.role) {
      const hasAccess = APP_ACCESS[appName]?.includes(profile.role as UserRole);
      if (!hasAccess) {
        return { user, profile, role: profile?.role || null };
      }
    }

    return {
      user,
      profile,
      role: profile?.role || null,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return { user: null, profile: null, role: null };
  }
});

// Protect routes that require authentication
export async function protectRoute(redirectTo: string = '/login'): Promise<User> {
  const { user } = await getServerUser('');

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

// Protect routes that require specific role
export async function protectRouteByRole(
  requiredRole: UserRole,
  appName: string,
  redirectTo: string = '/unauthorized'
): Promise<{ user: User; profile: Profile; role: UserRole }> {
  const { user, profile, role } = await getServerUser(appName);

  if (!user) {
    redirect('/login');
  }

  if (!role || !hasRequiredRole(role, requiredRole)) {
    redirect(redirectTo);
  }

  // Type assertion here is safe because we've already checked that these values exist
  return { user, profile: profile!, role };
}

// Protect routes by app with customizable redirection strategy
export async function protectRouteByApp(
  appName: string,
  redirectTo: string = '/unauthorized',
  options: { redirectToLogin?: boolean } = {}
): Promise<{ user: User; profile: Profile | null; role: UserRole | null }> {
  const { user, profile, role } = await getServerUser(appName);

  if (!user) {
    redirect(options.redirectToLogin ? '/login' : redirectTo);
  }

  // Check if user has access to this app
  if (role && APP_ACCESS[appName] && !APP_ACCESS[appName].includes(role)) {
    redirect(redirectTo);
  }

  return { user, profile, role };
}

// Middleware for redirecting by role
export async function redirectByRole(
  roleRedirects: Record<UserRole, string>,
  defaultRedirect: string = '/'
): Promise<never> {
  const { role } = await getServerUser('');

  if (role && roleRedirects[role]) {
    redirect(roleRedirects[role]);
  }

  redirect(defaultRedirect);
}
