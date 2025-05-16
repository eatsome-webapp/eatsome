import { User } from '@supabase/supabase-js';

type UserRole = 'customer' | 'courier' | 'restaurant_staff' | 'restaurant_admin' | 'platform_admin';
declare const ROLES: {
    CUSTOMER: "customer";
    COURIER: "courier";
    RESTAURANT_STAFF: "restaurant_staff";
    RESTAURANT_ADMIN: "restaurant_admin";
    PLATFORM_ADMIN: "platform_admin";
};
declare const ROLE_HIERARCHY: Record<UserRole, UserRole[]>;
declare function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean;
declare const APP_ACCESS: Record<string, UserRole[]>;
declare function hasAppAccess(appName: string, userRole?: UserRole): boolean;

interface Profile {
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
interface UserWithProfile extends User {
    profile: Profile | null;
}

export { APP_ACCESS as A, type Profile as P, ROLES as R, type UserWithProfile as U, type UserRole as a, ROLE_HIERARCHY as b, hasAppAccess as c, hasRequiredRole as h };
