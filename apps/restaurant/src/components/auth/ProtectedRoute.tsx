'use client';

import { useAuth } from '@eatsome/auth/client';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission,
  fallbackUrl = '/auth/login'
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  useEffect(() => {
    // Only check after authentication state is loaded
    if (!isLoading) {
      // If user is not logged in, redirect to login
      if (!user) {
        redirect(fallbackUrl);
      }
      
      // If a specific permission is required, check if user has it
      if (requiredPermission) {
        const authorized = hasPermission(requiredPermission);
        setIsAuthorized(authorized);
        
        // If user doesn't have the required permission, redirect to fallback
        if (!authorized) {
          redirect(fallbackUrl);
        }
      } else {
        // If no specific permission required, just being logged in is enough
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, requiredPermission, hasPermission, fallbackUrl]);
  
  // Show loading state while auth state is loading
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show nothing until we're authorized (to prevent flash of content)
  if (!isAuthorized) {
    return null;
  }
  
  // Render children when authorized
  return <>{children}</>;
}

// Basic loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
); 