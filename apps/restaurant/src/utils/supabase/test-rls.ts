/**
 * Utility functions for testing Row Level Security (RLS) policies
 * 
 * These functions help verify that RLS policies are working correctly
 * by attempting to access data with different user roles and contexts
 */

import { createClient } from './client';

type RlsTestResult = {
  success: boolean;
  data: unknown;
  error: unknown;
  message: string;
};

/**
 * Tests if the current user can access a restaurant's data
 */
export async function testRestaurantAccess(restaurantId: string): Promise<RlsTestResult> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();
      
    if (error) {
      return {
        success: false,
        data: null,
        error,
        message: `RLS policy prevented access to restaurant ${restaurantId}: ${error.message}`
      };
    }
    
    return {
      success: true,
      data,
      error: null,
      message: `Successfully accessed restaurant ${restaurantId}`
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
      message: `Error testing restaurant access: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Tests if the current user can access a restaurant's menu items
 */
export async function testMenuItemsAccess(restaurantId: string): Promise<RlsTestResult> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) {
      return {
        success: false,
        data: null,
        error,
        message: `RLS policy prevented access to menu items for restaurant ${restaurantId}: ${error.message}`
      };
    }
    
    return {
      success: true,
      data,
      error: null,
      message: `Successfully accessed ${data.length} menu items for restaurant ${restaurantId}`
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
      message: `Error testing menu items access: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Tests if the current user can access a restaurant's orders
 */
export async function testOrdersAccess(restaurantId: string): Promise<RlsTestResult> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) {
      return {
        success: false,
        data: null,
        error,
        message: `RLS policy prevented access to orders for restaurant ${restaurantId}: ${error.message}`
      };
    }
    
    return {
      success: true,
      data,
      error: null,
      message: `Successfully accessed ${data.length} orders for restaurant ${restaurantId}`
    };
  } catch (error) {
    return {
      success: false, 
      data: null,
      error,
      message: `Error testing orders access: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Runs a comprehensive test of all RLS policies for a restaurant
 */
export async function testAllRlsPolicies(restaurantId: string): Promise<Record<string, RlsTestResult>> {
  const results = {
    restaurant: await testRestaurantAccess(restaurantId),
    menuItems: await testMenuItemsAccess(restaurantId),
    orders: await testOrdersAccess(restaurantId)
  };
  
  return results;
} 