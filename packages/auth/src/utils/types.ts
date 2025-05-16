import type { User } from '@supabase/supabase-js';
import type { UserRole } from './roles';

export interface Profile {
  id: string;
  updated_at: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: UserRole;
  restaurant_id: string | null;
  metadata: Record<string, any> | null;
}

export interface UserWithProfile extends User {
  profile: Profile | null;
}
