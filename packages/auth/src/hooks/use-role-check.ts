'use client';

import { useAuth } from '../context/auth-context';
import type { UserRole } from '../utils/roles';
import { ROLE_HIERARCHY, APP_ACCESS } from '../utils/roles';

/**
 * Hook voor het controleren van gebruikersrollen en toegangsrechten
 */
export function useRoleCheck() {
  const { role, profile } = useAuth();

  /**
   * Controleert of de gebruiker een specifieke rol heeft
   */
  const hasExactRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole;
  };

  /**
   * Controleert of de gebruiker een vereiste rol of hoger heeft
   * (Hiërarchische controle)
   */
  const hasRequiredRole = (requiredRole: UserRole): boolean => {
    if (!role) return false;
    return ROLE_HIERARCHY[role].includes(requiredRole);
  };

  /**
   * Controleert of de gebruiker toegang heeft tot een specifieke app
   */
  const hasAppAccess = (appName: string): boolean => {
    if (!role) return false;

    return (
      APP_ACCESS[appName]?.some((appRole) => ROLE_HIERARCHY[role].includes(appRole as UserRole)) ||
      false
    );
  };

  /**
   * Controleert of de gebruiker toegang heeft tot een specifiek restaurant
   */
  const hasRestaurantAccess = (restaurantId: string): boolean => {
    if (!profile || !role) return false;

    // Platform admins hebben toegang tot alles
    if (role === 'platform_admin') return true;

    // Restaurant staff en admins hebben alleen toegang tot hun eigen restaurant
    if (['restaurant_staff', 'restaurant_admin'].includes(role)) {
      return profile.restaurant_id === restaurantId;
    }

    return false;
  };

  /**
   * Geeft de hoogste rol van de gebruiker terug
   */
  const getHighestRole = (): UserRole | null => {
    return role;
  };

  /**
   * Geeft alle rollen terug waartoe de gebruiker toegang heeft
   */
  const getAllAccessibleRoles = (): UserRole[] => {
    if (!role) return [];
    return ROLE_HIERARCHY[role];
  };

  return {
    hasExactRole,
    hasRequiredRole,
    hasAppAccess,
    hasRestaurantAccess,
    getHighestRole,
    getAllAccessibleRoles,
    role,
  };
}
