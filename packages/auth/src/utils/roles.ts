export type UserRole =
  | 'customer'
  | 'courier'
  | 'restaurant_staff'
  | 'restaurant_admin'
  | 'platform_admin';

export const ROLES = {
  CUSTOMER: 'customer' as const,
  COURIER: 'courier' as const,
  RESTAURANT_STAFF: 'restaurant_staff' as const,
  RESTAURANT_ADMIN: 'restaurant_admin' as const,
  PLATFORM_ADMIN: 'platform_admin' as const,
};

// Role hierarchy - each role inherits permissions from those before it
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  customer: ['customer'],
  courier: ['courier'],
  restaurant_staff: ['restaurant_staff'],
  restaurant_admin: ['restaurant_staff', 'restaurant_admin'],
  platform_admin: ['restaurant_staff', 'restaurant_admin', 'platform_admin'],
};

// Check if a user with a specific role can access content requiring a target role
export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole].includes(requiredRole);
}

// Define app access by role
export const APP_ACCESS: Record<string, UserRole[]> = {
  restaurant: ['restaurant_staff', 'restaurant_admin', 'platform_admin'],
  customer: ['customer', 'platform_admin'],
  courier: ['courier', 'platform_admin'],
  admin: ['platform_admin'],
};

// Check if a user has access to a specific app
export function hasAppAccess(appName: string, userRole?: UserRole): boolean {
  if (!userRole) return false;
  return APP_ACCESS[appName]?.some((role) => hasRequiredRole(userRole, role as UserRole)) || false;
}
