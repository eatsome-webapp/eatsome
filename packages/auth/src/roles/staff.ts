import { cache } from 'react';
import { Role, StaffRole } from '../types/roles';
import { getUser } from '../server';

/**
 * Checks if the current user is restaurant staff
 */
export const isStaff = cache(async () => {
  const user = await getUser();
  if (!user) return false;

  // Check user metadata for role
  return user.user_metadata.role === Role.RESTAURANT_STAFF;
});

/**
 * Gets the specific staff role (e.g., server, kitchen)
 */
export const getStaffRole = cache(async () => {
  const user = await getUser();
  if (!user) return null;

  // This would normally fetch from Supabase
  return user.user_metadata.staff_role as StaffRole;
});

/**
 * Checks if the staff member has permission for a specific action
 */
export const hasStaffPermission = cache(async (permission: string) => {
  const user = await getUser();
  if (!user) return false;

  // This is a placeholder - in a real app, you would have a more complex permission system
  const staffRole = user.user_metadata.staff_role as StaffRole;
  const staffPermissions = {
    [StaffRole.SERVER]: ['take_order', 'view_orders', 'mark_delivered'],
    [StaffRole.KITCHEN]: ['view_orders', 'update_order_status', 'mark_ready'],
    [StaffRole.CASHIER]: ['view_orders', 'process_payment', 'view_sales'],
    [StaffRole.HOST]: ['view_tables', 'assign_tables', 'view_reservations'],
    [StaffRole.MANAGER]: ['view_all', 'manage_staff', 'view_reports', 'update_menu']
  };

  return staffPermissions[staffRole]?.includes(permission) || false;
}); 