'use client'

import React, { ReactNode } from 'react'
import { usePermissions } from '../hooks/usePermissions'

interface PermissionGuardProps {
  restaurantId: string
  permission: string
  children: ReactNode
  fallback?: ReactNode
  loadingComponent?: ReactNode
}

/**
 * Een component dat UI conditioneel rendert op basis van permissies
 * 
 * @param props PermissionGuardProps
 * @returns UI alleen als de gebruiker de juiste permissie heeft
 */
export function PermissionGuard({
  restaurantId,
  permission,
  children,
  fallback = null,
  loadingComponent = <div>Loading permissions...</div>
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = usePermissions(restaurantId)
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

interface RoleGuardProps {
  restaurantId: string
  role: string | string[]
  children: ReactNode
  fallback?: ReactNode
  loadingComponent?: ReactNode
}

/**
 * Een component dat UI conditioneel rendert op basis van rollen
 * 
 * @param props RoleGuardProps
 * @returns UI alleen als de gebruiker de juiste rol heeft
 */
export function RoleGuard({
  restaurantId,
  role,
  children,
  fallback = null,
  loadingComponent = <div>Loading permissions...</div>
}: RoleGuardProps) {
  const { role: userRole, isLoading } = usePermissions(restaurantId)
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  // Als role een array is, controleer of userRole in de array zit
  if (Array.isArray(role)) {
    if (!userRole || !role.includes(userRole)) {
      return <>{fallback}</>
    }
  } else {
    // Als role een string is, controleer of userRole gelijk is
    if (!userRole || userRole !== role) {
      return <>{fallback}</>
    }
  }
  
  return <>{children}</>
} 