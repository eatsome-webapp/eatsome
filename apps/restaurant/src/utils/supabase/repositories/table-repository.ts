import { createClient } from '../client';
import type { RestaurantTable } from '@eatsome/database/types';

// Types from our Database definition
type InsertTable = Database['public']['Tables']['tables']['Insert'];
type UpdateTable = Database['public']['Tables']['tables']['Update'];

export class TableRepository {
  /**
   * Get all tables for a restaurant
   */
  static async getTables(restaurantId: string): Promise<RestaurantTable[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('name');
      
    if (error) {
      console.error(`Error fetching tables for restaurant ${restaurantId}:`, error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get a specific table by ID
   */
  static async getTableById(id: string): Promise<RestaurantTable | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // not found
        return null;
      }
      console.error(`Error fetching table ${id}:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Create a new table
   */
  static async createTable(table: InsertTable): Promise<RestaurantTable> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('tables')
      .insert(table)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating table:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create table');
    }
    
    return data;
  }
  
  /**
   * Update a table
   */
  static async updateTable(id: string, tableData: UpdateTable): Promise<RestaurantTable> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('tables')
      .update({
        ...tableData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating table ${id}:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Delete a table
   */
  static async deleteTable(id: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting table ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Update table status
   */
  static async updateTableStatus(
    id: string, 
    status: RestaurantTable['status']
  ): Promise<RestaurantTable> {
    return this.updateTable(id, { status });
  }
  
  /**
   * Get all available tables for a restaurant
   */
  static async getAvailableTables(restaurantId: string): Promise<RestaurantTable[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'available')
      .order('name');
      
    if (error) {
      console.error(`Error fetching available tables for restaurant ${restaurantId}:`, error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get tables by status
   */
  static async getTablesByStatus(
    restaurantId: string, 
    status: RestaurantTable['status']
  ): Promise<RestaurantTable[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('status', status)
      .order('name');
      
    if (error) {
      console.error(`Error fetching ${status} tables for restaurant ${restaurantId}:`, error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Reserve a table
   */
  static async reserveTable(id: string): Promise<RestaurantTable> {
    return this.updateTableStatus(id, 'reserved');
  }
  
  /**
   * Set a table as occupied
   */
  static async occupyTable(id: string): Promise<RestaurantTable> {
    return this.updateTableStatus(id, 'occupied');
  }
  
  /**
   * Free up a table (mark as available)
   */
  static async freeTable(id: string): Promise<RestaurantTable> {
    return this.updateTableStatus(id, 'available');
  }
  
  /**
   * Update table positions
   */
  static async updateTablePosition(
    id: string, 
    posX: number, 
    posY: number
  ): Promise<RestaurantTable> {
    return this.updateTable(id, { position_x: posX, position_y: posY });
  }
  
  /**
   * Update multiple table positions at once
   */
  static async updateTablePositions(
    tables: Array<{ id: string; posX: number; posY: number }>
  ): Promise<void> {
    const supabase = createClient();
    
    // Since Supabase doesn't directly support transactions, we'll handle this
    // by running multiple operations
    for (const table of tables) {
      const { error } = await supabase
        .from('tables')
        .update({
          position_x: table.posX,
          position_y: table.posY,
          updated_at: new Date().toISOString()
        })
        .eq('id', table.id);
        
      if (error) {
        console.error(`Error updating table ${table.id} position:`, error);
        throw error;
      }
    }
  }
} 