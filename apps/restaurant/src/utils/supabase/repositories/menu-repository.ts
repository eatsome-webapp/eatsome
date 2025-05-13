import { createClient } from '../client';
import { Database } from '../types';

// Types from our Database definition
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type InsertMenuCategory = Database['public']['Tables']['menu_categories']['Insert'];
type UpdateMenuCategory = Database['public']['Tables']['menu_categories']['Update'];

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type InsertMenuItem = Database['public']['Tables']['menu_items']['Insert'];
type UpdateMenuItem = Database['public']['Tables']['menu_items']['Update'];

export class MenuRepository {
  /**
   * Get all menu categories for a restaurant
   */
  static async getCategories(restaurantId: string): Promise<MenuCategory[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('sort_order');
      
    if (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get a single menu category by ID
   */
  static async getCategoryById(id: string): Promise<MenuCategory | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching menu category:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Create a new menu category
   */
  static async createCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('menu_categories')
      .insert(category)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating menu category:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create menu category');
    }
    
    return data;
  }
  
  /**
   * Update an existing menu category
   */
  static async updateCategory(id: string, updates: UpdateMenuCategory): Promise<MenuCategory> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating menu category:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to update menu category');
    }
    
    return data;
  }
  
  /**
   * Delete a menu category by ID
   */
  static async deleteCategory(id: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting menu category:', error);
      throw error;
    }
  }
  
  /**
   * Get all menu items for a restaurant, optionally filtered by category
   */
  static async getMenuItems(restaurantId: string, categoryId?: string): Promise<MenuItem[]> {
    const supabase = createClient();
    
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('sort_order');
      
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get a single menu item by ID
   */
  static async getMenuItemById(id: string): Promise<MenuItem | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching menu item:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Create a new menu item
   */
  static async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create menu item');
    }
    
    return data;
  }
  
  /**
   * Update an existing menu item
   */
  static async updateMenuItem(id: string, updates: UpdateMenuItem): Promise<MenuItem> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to update menu item');
    }
    
    return data;
  }
  
  /**
   * Delete a menu item by ID
   */
  static async deleteMenuItem(id: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }
  
  /**
   * Toggle the availability of a menu item
   */
  static async toggleMenuItemAvailability(id: string): Promise<MenuItem> {
    const supabase = createClient();
    
    // First get the current item
    const item = await this.getMenuItemById(id);
    if (!item) {
      throw new Error('Menu item not found');
    }
    
    // Toggle the availability
    return await this.updateMenuItem(id, { is_available: !item.is_available });
  }
  
  /**
   * Update the sort order of menu categories
   */
  static async updateCategorySortOrder(sortedIds: string[]): Promise<void> {
    const supabase = createClient();
    
    // Update each category with its new sort order
    const promises = sortedIds.map((id, index) => 
      supabase
        .from('menu_categories')
        .update({ sort_order: index })
        .eq('id', id)
    );
    
    await Promise.all(promises);
  }
  
  /**
   * Update the sort order of menu items
   */
  static async updateMenuItemSortOrder(sortedIds: string[]): Promise<void> {
    const supabase = createClient();
    
    // Update each item with its new sort order
    const promises = sortedIds.map((id, index) => 
      supabase
        .from('menu_items')
        .update({ sort_order: index })
        .eq('id', id)
    );
    
    await Promise.all(promises);
  }
} 