'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../'
import { useAuthContext } from '../components/AuthProvider'

// Definieer permissies per rol
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  // Restaurant member rollen
  'owner': [
    'view_dashboard',
    'view_orders',
    'manage_orders',
    'view_menu',
    'manage_menu',
    'view_tables',
    'manage_tables',
    'view_staff',
    'manage_staff',
    'view_settings',
    'manage_settings',
    'view_analytics'
  ],
  'manager': [
    'view_dashboard',
    'view_orders',
    'manage_orders',
    'view_menu',
    'manage_menu',
    'view_tables',
    'manage_tables',
    'view_analytics'
  ],
  'staff': [
    'view_dashboard',
    'view_orders',
    'manage_orders',
    'view_tables'
  ]
}

/**
 * Hook om permissies te controleren voor een specifiek restaurant
 * 
 * @param restaurantId Het restaurant ID waarvoor permissies moeten worden gecontroleerd
 * @returns Een object met permissies en helper functies
 */
export function usePermissions(restaurantId?: string) {
  const [role, setRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isLoading: isAuthLoading } = useAuthContext()
  const supabase = createClient()
  
  // Functie om de permissies op te halen op basis van restaurantId
  const loadPermissions = useCallback(async () => {
    if (!restaurantId || !user) {
      setPermissions([])
      setRole(null)
      setIsLoading(false)
      return
    }
    
    try {
      // Haal de gebruikersrol op voor het restaurant
      const { data, error } = await supabase
        .from('restaurant_members')
        .select('role')
        .eq('restaurant_id', restaurantId)
        .eq('user_id', user.id)
        .single()
      
      if (error || !data) {
        console.error('Error loading role or no role found')
        setPermissions([])
        setRole(null)
        setIsLoading(false)
        return
      }
      
      // Sla de rol op
      setRole(data.role)
      
      // Zoek de bijbehorende permissies op
      const rolePermissions = ROLE_PERMISSIONS[data.role] || []
      setPermissions(rolePermissions)
    } catch (error) {
      console.error('Error in usePermissions hook:', error)
      setPermissions([])
      setRole(null)
    } finally {
      setIsLoading(false)
    }
  }, [restaurantId, user, supabase])
  
  // Laad permissies wanneer restaurantId of user verandert
  useEffect(() => {
    if (!isAuthLoading) {
      loadPermissions()
    }
  }, [isAuthLoading, loadPermissions])
  
  // Functie om te controleren of een specifieke permissie aanwezig is
  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  )
  
  // Functie om te controleren of de gebruiker een specifieke rol heeft
  const hasRole = useCallback(
    (checkRole: string) => role === checkRole,
    [role]
  )
  
  // Functie om te controleren of de gebruiker een eigenaar is
  const isOwner = useCallback(() => role === 'owner', [role])
  
  // Functie om te controleren of de gebruiker een manager is
  const isManager = useCallback(() => role === 'manager', [role])
  
  // Functie om te controleren of de gebruiker een medewerker is
  const isStaff = useCallback(() => role === 'staff', [role])
  
  return {
    role,
    permissions,
    isLoading,
    hasPermission,
    hasRole,
    isOwner,
    isManager,
    isStaff,
    refreshPermissions: loadPermissions
  }
} 