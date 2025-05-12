import { createClient } from '@eatsome/auth/server';
import type { 
  Restaurant, 
  MenuCategory, 
  MenuItem,
  RestaurantTable,
  Order,
  OrderItem,
  RestaurantStaff
} from '../types';

/**
 * Restaurant service for interacting with the Supabase database
 */
export class RestaurantService {
  /**
   * Get all restaurants that the current user has access to
   */
  static async getUserRestaurants() {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('restaurant_staff')
      .select(`
        restaurant_id,
        role,
        restaurants:restaurant_id (
          id,
          name,
          description,
          address,
          logo_url,
          cover_image_url,
          is_active
        )
      `);
    
    if (error) {
      console.error('Error getting user restaurants:', error);
      return [];
    }
    
    return data.map(item => ({
      ...item.restaurants,
      role: item.role
    }));
  }
  
  /**
   * Get a restaurant by ID
   */
  static async getRestaurantById(id: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting restaurant:', error);
      return null;
    }
    
    return data as Restaurant;
  }
  
  /**
   * Get menu categories for a restaurant
   */
  static async getMenuCategories(restaurantId: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error getting menu categories:', error);
      return [];
    }
    
    return data as MenuCategory[];
  }
  
  /**
   * Get menu items for a restaurant or category
   */
  static async getMenuItems(restaurantId: string, categoryId?: string) {
    const supabase = await createClient();
    
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId);
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
    
    return data as MenuItem[];
  }

  /**
   * Get tables for a restaurant
   */
  static async getTables(restaurantId: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', restaurantId);
    
    if (error) {
      console.error('Error getting tables:', error);
      return [];
    }
    
    return data as RestaurantTable[];
  }
  
  /**
   * Get orders for a restaurant
   */
  static async getOrders(restaurantId: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items (
          *,
          menu_item:menu_item_id (
            name
          )
        ),
        table:table_id (
          name
        ),
        customer:customer_id (
          email
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting orders:', error);
      return [];
    }
    
    return data as Order[];
  }
} 