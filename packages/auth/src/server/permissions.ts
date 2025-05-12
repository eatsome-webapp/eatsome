import { createServerComponentClient } from './index'

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
 * Controleert of een gebruiker een specifieke permissie heeft voor een restaurant
 * 
 * @param userId User ID om te controleren
 * @param restaurantId Restaurant ID om te controleren
 * @param permission De vereiste permissie
 * @returns boolean - true als gebruiker de permissie heeft
 */
export async function hasPermission(
  userId: string,
  restaurantId: string,
  permission: string
): Promise<boolean> {
  const supabase = await createServerComponentClient()
  
  try {
    // Haal de rol van de gebruiker op voor het opgegeven restaurant
    const { data, error } = await supabase
      .from('restaurant_members')
      .select('role')
      .eq('restaurant_id', restaurantId)
      .eq('user_id', userId)
      .single()
    
    if (error || !data) {
      console.error('Error checking permission or no membership found:', error?.message)
      return false
    }
    
    // Haal de permissies op voor deze rol
    const rolePermissions = ROLE_PERMISSIONS[data.role] || []
    
    // Controleer of de vereiste permissie aanwezig is
    return rolePermissions.includes(permission)
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

/**
 * Controleert of een gebruiker een restaurant eigenaar is
 * 
 * @param userId User ID om te controleren
 * @param restaurantId Restaurant ID om te controleren
 * @returns boolean - true als gebruiker een eigenaar is
 */
export async function isRestaurantOwner(
  userId: string,
  restaurantId: string
): Promise<boolean> {
  const supabase = await createServerComponentClient()
  
  try {
    // Check if user is an owner
    const { data, error } = await supabase
      .from('restaurant_members')
      .select('role')
      .eq('restaurant_id', restaurantId)
      .eq('user_id', userId)
      .eq('role', 'owner')
      .single()
    
    return !!data && !error
  } catch (error) {
    console.error('Error checking restaurant ownership:', error)
    return false
  }
}

/**
 * Controleert of een gebruiker een platform admin is
 * 
 * @param userId User ID om te controleren
 * @returns boolean - true als gebruiker een admin is
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerComponentClient()
  
  try {
    // Check if user is an admin
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    return data?.role === 'admin' && !error
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
} 