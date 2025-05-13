'use client';

import { useAuth, UserRole } from '@eatsome/auth/client';
import { ReactNode } from 'react';

interface RoleGuardProps {
  requiredRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ 
  requiredRole, 
  children, 
  fallback = null 
}: RoleGuardProps) {
  const { userHasRole } = useAuth();
  
  if (userHasRole(requiredRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
} 