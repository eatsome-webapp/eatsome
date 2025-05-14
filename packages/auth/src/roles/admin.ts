import { cache } from 'react';
import { Role } from '../types/roles';
import { getUser } from '../server';

/**
 * Checks if the current user is a restaurant admin
 */
export const isRestaurantAdmin = cache(async () => {
  const user = await getUser();
  if (!user) return false;

  // Check user metadata for role
  return user.user_metadata.role === Role.RESTAURANT_ADMIN;
});

/**
 * Checks if the current user is a platform admin
 */
export const isPlatformAdmin = cache(async () => {
  const user = await getUser();
  if (!user) return false;

  // Check user metadata for role
  return user.user_metadata.role === Role.PLATFORM_ADMIN;
});

/**
 * Gets all restaurants this admin has access to
 */
export const getAdminRestaurants = cache(async () => {
  const user = await getUser();
  if (!user) return [];

  // In a real app, this would query Supabase for the admin's restaurants
  return user.user_metadata.restaurants || [];
});

/**
 * Checks if the admin has access to a specific restaurant
 */
export const hasRestaurantAdminAccess = cache(async (restaurantId: string) => {
  const user = await getUser();
  if (!user) return false;

  // Platform admins have access to all restaurants
  if (user.user_metadata.role === Role.PLATFORM_ADMIN) return true;

  // Check if restaurant is in the admin's list
  const restaurants = user.user_metadata.restaurants || [];
  return restaurants.includes(restaurantId);
}); 