import { createClient } from '../client';
import type { Profile } from '@eatsome/database/types';

// Types from our Database definition
type InsertProfile = Database['public']['Tables']['profiles']['Insert'];
type UpdateProfile = Database['public']['Tables']['profiles']['Update'];

export class UserRepository {
  /**
   * Get current logged in user's profile
   */
  static async getCurrentUserProfile(): Promise<Profile | null> {
    const supabase = createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }
    
    // Get the user's profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // not found
        return null;
      }
      console.error('Error fetching current user profile:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Get a user profile by ID
   */
  static async getUserProfileById(userId: string): Promise<Profile | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // not found
        return null;
      }
      console.error(`Error fetching user profile for ${userId}:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Update a user's profile
   */
  static async updateUserProfile(userId: string, profile: UpdateProfile): Promise<Profile> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Get multiple user profiles by IDs
   */
  static async getUserProfilesByIds(userIds: string[]): Promise<Profile[]> {
    if (!userIds.length) return [];
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (error) {
      console.error('Error fetching user profiles:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Update current user's profile
   */
  static async updateCurrentUserProfile(profile: UpdateProfile): Promise<Profile> {
    const supabase = createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    return this.updateUserProfile(user.id, profile);
  }
  
  /**
   * Search for users by email (typically for inviting staff members)
   */
  static async searchUsersByEmail(email: string): Promise<Profile[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%${email}%`)
      .limit(10);
      
    if (error) {
      console.error(`Error searching users with email ${email}:`, error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Update user avatar
   */
  static async updateUserAvatar(userId: string, avatarUrl: string): Promise<Profile> {
    return this.updateUserProfile(userId, { avatar_url: avatarUrl });
  }
  
  /**
   * Check if current user has a specific role
   */
  static async checkUserRole(role: string): Promise<boolean> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    return data.role === role;
  }
  
  /**
   * Delete a user (admin only)
   */
  static async deleteUser(userId: string): Promise<void> {
    const supabase = createClient();
    
    // First check if current user is admin
    const isAdmin = await this.checkUserRole('admin');
    if (!isAdmin) {
      throw new Error('Only admins can delete users');
    }
    
    // Delete user profile and Supabase auth will cascade 
    // Note: In a real implementation, you would typically use an admin function
    // or a trigger to handle this properly
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }
} 