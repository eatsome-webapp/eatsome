import { supabase } from '@/utils/supabase/client';
import { MenuItem, MenuCategory, Table, Order, OrderItem } from '@/types';

/**
 * Repository for POS-related database operations
 */
export class POSRepository {
  /**
   * Fetch all menu categories for a restaurant
   */
  static async getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order');
    
    if (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Fetch all menu items for a restaurant
   */
  static async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories!inner(restaurant_id)
      `)
      .eq('menu_categories.restaurant_id', restaurantId)
      .order('display_order');
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Fetch menu items by category
   */
  static async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_order');
    
    if (error) {
      console.error('Error fetching menu items by category:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Fetch all tables for a restaurant
   */
  static async getTables(restaurantId: string): Promise<Table[]> {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', restaurantId);
    
    if (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Update table status
   */
  static async updateTableStatus(tableId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('restaurant_tables')
      .update({ status })
      .eq('id', tableId);
    
    if (error) {
      console.error('Error updating table status:', error);
      throw error;
    }
  }
  
  /**
   * Create a new order
   */
  static async createOrder(order: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Add items to an order
   */
  static async addOrderItems(items: Partial<OrderItem>[]): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select();
    
    if (error) {
      console.error('Error adding order items:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
  
  /**
   * Get active orders for a restaurant
   */
  static async getActiveOrders(restaurantId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('restaurant_id', restaurantId)
      .in('status', ['new', 'confirmed', 'preparing', 'ready'])
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active orders:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get order by ID with items
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) {
      console.error('Error fetching order:', error);
      if (error.code === 'PGRST116') {
        // No rows returned - order not found
        return null;
      }
      throw error;
    }
    
    return data;
  }
  
  /**
   * Get orders for a table
   */
  static async getOrdersByTable(tableId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('table_id', tableId)
      .in('status', ['new', 'confirmed', 'preparing', 'ready'])
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching table orders:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get daily sales for a restaurant
   */
  static async getDailySales(restaurantId: string, date: string): Promise<any> {
    // Format date range for the entire day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        order_type,
        payment_status,
        created_at
      `)
      .eq('restaurant_id', restaurantId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (error) {
      console.error('Error fetching daily sales:', error);
      throw error;
    }
    
    // Calculate totals
    const totalSales = data.reduce((sum, order) => {
      // Only count completed orders
      if (['completed', 'delivered'].includes(order.status)) {
        return sum + (order.total_amount || 0);
      }
      return sum;
    }, 0);
    
    const orderCount = data.length;
    
    const ordersByType = data.reduce((acc: Record<string, number>, order) => {
      const type = order.order_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalSales,
      orderCount,
      ordersByType,
      orders: data
    };
  }
} 