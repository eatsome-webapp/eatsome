'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import type { UserRole } from './roles';
import { hasRequiredRole } from './roles';

// Client-side route protection hook using the auth context
export function useProtectRoute(redirectPath: string = '/login') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !user) {
    router.push(redirectPath);
  }

  return { user, isLoading };
}

// Client-side role protection hook
export function useProtectRouteByRole(
  requiredRole: UserRole,
  redirectPath: string = '/unauthorized'
) {
  const { user, profile, role, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading) {
    if (!user) {
      router.push('/login');
      return { user: null, profile: null, role: null, isLoading };
    }

    if (!role || !hasRequiredRole(role, requiredRole)) {
      router.push(redirectPath);
    }
  }

  return { user, profile, role, isLoading };
}

// Client-side app protection hook
export function useProtectRouteByApp(appName: string, redirectPath: string = '/unauthorized') {
  const { user, profile, role, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading) {
    if (!user) {
      router.push('/login');
      return { user: null, profile: null, role: null, isLoading };
    }

    // App-specific role checks can be added here
    if (!role) {
      router.push(redirectPath);
    }
  }

  return { user, profile, role, isLoading };
}
