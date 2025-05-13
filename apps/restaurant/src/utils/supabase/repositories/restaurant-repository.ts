import { createClient } from '../client';
import { Database } from '../types';

// Type for Restaurant from our Database types
type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type InsertRestaurant = Database['public']['Tables']['restaurants']['Insert'];
type UpdateRestaurant = Database['public']['Tables']['restaurants']['Update'];

// Restaurant staff type
type RestaurantStaff = Database['public']['Tables']['restaurant_staff']['Row'];
type InsertRestaurantStaff = Database['public']['Tables']['restaurant_staff']['Insert'];

export class RestaurantRepository {
  /**
   * Get all restaurants the current user has access to
   */
  static async getMyRestaurants(): Promise<Restaurant[]> {
    const supabase = createClient();
    
    // Get restaurants where the user is staff
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get a single restaurant by ID
   */
  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching restaurant:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Create a new restaurant
   */
  static async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurant)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create restaurant');
    }
    
    // Add the current user as owner of this restaurant
    await this.addStaffMember({
      restaurant_id: data.id,
      role: 'owner'
    });
    
    return data;
  }
  
  /**
   * Update an existing restaurant
   */
  static async updateRestaurant(id: string, updates: UpdateRestaurant): Promise<Restaurant> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to update restaurant');
    }
    
    return data;
  }
  
  /**
   * Delete a restaurant by ID
   */
  static async deleteRestaurant(id: string): Promise<void> {
    const supabase = createClient();
    
    // Note: This will cascade delete if you have set up proper foreign key constraints
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  }
  
  /**
   * Get all staff members for a restaurant
   */
  static async getStaffMembers(restaurantId: string): Promise<RestaurantStaff[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('restaurant_staff')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) {
      console.error('Error fetching staff members:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Add a staff member to a restaurant
   */
  static async addStaffMember(staffMember: InsertRestaurantStaff): Promise<RestaurantStaff> {
    const supabase = createClient();
    
    // If user_id isn't provided, use the current user
    const member = { ...staffMember };
    if (!member.user_id) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }
      member.user_id = user.id;
    }
    
    const { data, error } = await supabase
      .from('restaurant_staff')
      .insert(member)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding staff member:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to add staff member');
    }
    
    return data;
  }
  
  /**
   * Remove a staff member from a restaurant
   */
  static async removeStaffMember(staffId: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('restaurant_staff')
      .delete()
      .eq('id', staffId);
      
    if (error) {
      console.error('Error removing staff member:', error);
      throw error;
    }
  }
  
  /**
   * Check if the current user is staff at a restaurant
   */
  static async isUserStaffAtRestaurant(restaurantId: string): Promise<boolean> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('restaurant_staff')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .limit(1);
      
    if (error) {
      console.error('Error checking staff status:', error);
      return false;
    }
    
    return data && data.length > 0;
  }
} 