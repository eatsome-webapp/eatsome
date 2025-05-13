import { createClient } from '../client';
import type { Order, OrderItem } from '@eatsome/database/types';

// Types from our Database definition
type InsertOrder = Database['public']['Tables']['orders']['Insert'];
type UpdateOrder = Database['public']['Tables']['orders']['Update'];
type InsertOrderItem = Database['public']['Tables']['order_items']['Insert'];
type UpdateOrderItem = Database['public']['Tables']['order_items']['Update'];

export class OrderRepository {
  /**
   * Get all orders for a restaurant
   */
  static async getOrders(restaurantId: string, status?: string): Promise<Order[]> {
    const supabase = createClient();
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          menu_item_id,
          quantity,
          price,
          notes,
          menu_item:menu_items (
            name
          )
        ),
        table:tables (
          name
        ),
        customer:profiles (
          email
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
      
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching orders for restaurant ${restaurantId}:`, error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get a specific order by ID
   */
  static async getOrderById(id: string): Promise<Order | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          menu_item_id,
          quantity,
          price,
          notes,
          menu_item:menu_items (
            id,
            name,
            description,
            price,
            image_url
          )
        ),
        table:tables (
          id,
          name,
          capacity
        ),
        customer:profiles (
          id,
          email,
          full_name
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // not found
        return null;
      }
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Get recent orders for a restaurant
   */
  static async getRecentOrders(restaurantId: string, limit: number = 10): Promise<Order[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          menu_item_id,
          quantity,
          price,
          notes,
          menu_item:menu_items (
            name
          )
        ),
        table:tables (
          name
        ),
        customer:profiles (
          email
        )
      `)
      .eq('restaurant_id', restaurantId)
      .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching recent orders for restaurant ${restaurantId}:`, error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Create a new order
   */
  static async createOrder(order: InsertOrder, orderItems: InsertOrderItem[]): Promise<Order> {
    const supabase = createClient();
    
    // Start a transaction by using the single function
    // We're not actually using Postgres transactions here since Supabase doesn't 
    // directly support them in the JS client
    
    // First create the order
    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
      
    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }
    
    if (!createdOrder) {
      throw new Error('Failed to create order');
    }
    
    // Then create all order items
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: createdOrder.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);
      
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Ideally we would rollback here, but we'll need to delete manually
      await supabase.from('orders').delete().eq('id', createdOrder.id);
      throw itemsError;
    }
    
    // Return the created order with items by fetching it
    return this.getOrderById(createdOrder.id) as Promise<Order>;
  }
  
  /**
   * Update an order's status
   */
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Update an order
   */
  static async updateOrder(orderId: string, orderData: UpdateOrder): Promise<Order> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .update({
        ...orderData,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating order ${orderId}:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Delete an order
   */
  static async deleteOrder(orderId: string): Promise<void> {
    const supabase = createClient();
    
    // First delete all related order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);
      
    if (itemsError) {
      console.error(`Error deleting order items for order ${orderId}:`, itemsError);
      throw itemsError;
    }
    
    // Then delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
      
    if (error) {
      console.error(`Error deleting order ${orderId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update an order item
   */
  static async updateOrderItem(itemId: string, itemData: UpdateOrderItem): Promise<OrderItem> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('order_items')
      .update({
        ...itemData,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating order item ${itemId}:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Add an item to an existing order
   */
  static async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('order_items')
      .insert(item)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding order item:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Remove an item from an order
   */
  static async removeOrderItem(itemId: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId);
      
    if (error) {
      console.error(`Error removing order item ${itemId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get order analytics for a restaurant
   */
  static async getOrderAnalytics(
    restaurantId: string,
    startDate: string,
    endDate: string
  ): Promise<{ total: number; count: number; average: number }> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'completed')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
      
    if (error) {
      console.error('Error fetching order analytics:', error);
      throw error;
    }
    
    const total = data.reduce((sum, order) => sum + order.total_amount, 0);
    const count = data.length;
    const average = count > 0 ? total / count : 0;
    
    return { total, count, average };
  }
} 