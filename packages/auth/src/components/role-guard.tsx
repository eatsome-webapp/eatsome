'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../context/auth-context';
import type { UserRole } from '../utils/roles';

interface RoleGuardProps {
  /**
   * The role required to view this content
   */
  requiredRole: UserRole;

  /**
   * The content to show when the user has the required role
   */
  children: ReactNode;

  /**
   * Content to show when the user doesn't have the required role
   * If not provided, nothing will be rendered
   */
  fallback?: ReactNode;

  /**
   * Whether to render nothing when loading
   * @default false
   */
  hideWhileLoading?: boolean;

  /**
   * Optional loading component
   */
  loading?: ReactNode;
}

/**
 * Guard component that only renders its children if the user has the required role
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredRole,
  children,
  fallback = null,
  hideWhileLoading = false,
  loading = <div className='animate-pulse'>Loading...</div>,
}) => {
  const { isLoading, hasRequiredRole } = useAuth();

  // If still loading and hideWhileLoading is true, render nothing
  if (isLoading && hideWhileLoading) {
    return null;
  }

  // If still loading, show loading component
  if (isLoading) {
    return <>{loading}</>;
  }

  // If user has the required role, show the children
  if (hasRequiredRole(requiredRole)) {
    return <>{children}</>;
  }

  // Otherwise, show the fallback content (or nothing)
  return <>{fallback}</>;
};

interface RoleContentProps {
  /**
   * The role that should see this content
   */
  role: UserRole;

  /**
   * Content for this role
   */
  children: ReactNode;
}

interface RoleContentSwitchProps {
  /**
   * Array of role-specific content options
   */
  children: React.ReactElement<RoleContentProps>[];

  /**
   * Content to show when none of the roles match
   */
  fallback?: ReactNode;

  /**
   * Loading component
   */
  loading?: ReactNode;
}

/**
 * Component for role-specific content
 */
export const RoleContent: React.FC<RoleContentProps> = ({ role, children }) => {
  return <>{children}</>;
};

RoleContent.displayName = 'RoleContent';

/**
 * Component that switches between different content based on user's role
 */
export const RoleContentSwitch: React.FC<RoleContentSwitchProps> = ({
  children,
  fallback = null,
  loading = <div className='animate-pulse'>Loading...</div>,
}) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!role) {
    return <>{fallback}</>;
  }

  // Find the first RoleContent component that matches the user's role
  const matchingContent = React.Children.toArray(children).find((child) => {
    if (React.isValidElement(child) && child.type === RoleContent) {
      return child.props.role === role;
    }
    return false;
  });

  if (matchingContent) {
    return <>{matchingContent}</>;
  }

  return <>{fallback}</>;
};

/**
 * Component that only shows content to authenticated users
 */
export const AuthGuard: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
  hideWhileLoading?: boolean;
}> = ({
  children,
  fallback = null,
  loading = <div className='animate-pulse'>Loading...</div>,
  hideWhileLoading = false,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading && hideWhileLoading) {
    return null;
  }

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
