import { createServerComponentClient } from '@eatsome/auth/server';
import type { Database } from '@eatsome/auth';

export class RestaurantService {
  /**
   * Gets all restaurants for the current user
   */
  static async getUserRestaurants(userId: string) {
    const supabase = await createServerComponentClient();
    
    const { data: staffRecords, error: staffError } = await supabase
      .from('restaurant_staff')
      .select('restaurant_id, role')
      .eq('user_id', userId);
    
    if (staffError) {
      console.error('Error fetching staff records:', staffError);
      return [];
    }
    
    if (!staffRecords.length) {
      return [];
    }
    
    const restaurantIds = staffRecords.map(record => record.restaurant_id);
    
    const { data: restaurants, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .in('id', restaurantIds);
    
    if (restaurantError) {
      console.error('Error fetching restaurants:', restaurantError);
      return [];
    }
    
    // Combine restaurant data with staff role information
    return restaurants.map(restaurant => {
      const staffRecord = staffRecords.find(record => record.restaurant_id === restaurant.id);
      return {
        ...restaurant,
        role: staffRecord?.role || null
      };
    });
  }
  
  /**
   * Get a restaurant by ID if the user has access
   */
  static async getRestaurant(restaurantId: string, userId: string) {
    const supabase = await createServerComponentClient();
    
    // First check if user has access to this restaurant
    const { data: staffRecord, error: staffError } = await supabase
      .from('restaurant_staff')
      .select('role')
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
      .single();
    
    if (staffError || !staffRecord) {
      return null; // User doesn't have access or an error occurred
    }
    
    // Now fetch the restaurant details
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();
    
    if (restaurantError || !restaurant) {
      return null;
    }
    
    return {
      ...restaurant,
      role: staffRecord.role
    };
  }
  
  /**
   * Create a new restaurant
   */
  static async createRestaurant(
    restaurantData: Database['public']['Tables']['restaurants']['Insert'],
    userId: string
  ) {
    const supabase = await createServerComponentClient();
    
    // Start a transaction
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert(restaurantData)
      .select('*')
      .single();
    
    if (restaurantError || !restaurant) {
      console.error('Error creating restaurant:', restaurantError);
      return null;
    }
    
    // Add the creator as owner
    const { error: staffError } = await supabase
      .from('restaurant_staff')
      .insert({
        restaurant_id: restaurant.id,
        user_id: userId,
        role: 'owner'
      });
    
    if (staffError) {
      console.error('Error adding owner:', staffError);
      // We should ideally roll back the restaurant creation here
      return null;
    }
    
    return {
      ...restaurant,
      role: 'owner'
    };
  }
  
  /**
   * Update restaurant details
   */
  static async updateRestaurant(
    restaurantId: string,
    restaurantData: Partial<Database['public']['Tables']['restaurants']['Update']>,
    userId: string
  ) {
    const supabase = await createServerComponentClient();
    
    // First check if user has permission to update (must be owner or manager)
    const { data: staffRecord, error: staffError } = await supabase
      .from('restaurant_staff')
      .select('role')
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
      .single();
    
    if (staffError || !staffRecord) {
      return null; // User doesn't have access
    }
    
    if (!['owner', 'manager'].includes(staffRecord.role)) {
      return null; // User doesn't have permission
    }
    
    // Now update the restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .update(restaurantData)
      .eq('id', restaurantId)
      .select('*')
      .single();
    
    if (restaurantError || !restaurant) {
      console.error('Error updating restaurant:', restaurantError);
      return null;
    }
    
    return {
      ...restaurant,
      role: staffRecord.role
    };
  }
  
  /**
   * Add a staff member to restaurant
   */
  static async addStaffMember(
    restaurantId: string, 
    email: string, 
    role: string,
    currentUserId: string
  ) {
    const supabase = await createServerComponentClient();
    
    // First check if current user is owner
    const { data: currentStaff, error: currentStaffError } = await supabase
      .from('restaurant_staff')
      .select('role')
      .eq('user_id', currentUserId)
      .eq('restaurant_id', restaurantId)
      .single();
    
    if (currentStaffError || !currentStaff || currentStaff.role !== 'owner') {
      return null; // Only owners can add staff
    }
    
    // Find the user by email
    const { data: userRecord, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    if (userError || !userRecord) {
      console.error('Error finding user:', userError);
      return null;
    }
    
    // Add staff member
    const { data: staff, error: staffError } = await supabase
      .from('restaurant_staff')
      .insert({
        restaurant_id: restaurantId,
        user_id: userRecord.id,
        role
      })
      .select('*, profiles!inner(*)')
      .single();
    
    if (staffError) {
      console.error('Error adding staff member:', staffError);
      return null;
    }
    
    return staff;
  }
} 