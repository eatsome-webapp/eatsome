import * as _supabase_supabase_js from '@supabase/supabase-js';
import { a as UserRole } from './types-DIoM8QhV.js';
export { A as APP_ACCESS, P as Profile, R as ROLES, b as ROLE_HIERARCHY, U as UserWithProfile, c as hasAppAccess, h as hasRequiredRole } from './types-DIoM8QhV.js';

declare function getServerUser(appName: string): Promise<{
    user: null;
    profile: null;
    role: null;
} | {
    user: _supabase_supabase_js.AuthUser;
    profile: any;
    role: any;
}>;
declare function protectRoute(redirectPath?: string): Promise<_supabase_supabase_js.AuthUser>;
declare function protectRouteByRole(requiredRole: UserRole, appName: string, redirectPath?: string): Promise<{
    user: _supabase_supabase_js.AuthUser;
    profile: any;
    role: any;
}>;
declare function protectRouteByApp(appName: string, redirectPath?: string): Promise<{
    user: _supabase_supabase_js.AuthUser;
    profile: any;
    role: any;
}>;

declare function createServerSupabaseClient(): Promise<_supabase_supabase_js.SupabaseClient<any, "public", any>>;
declare function getUserRole(): Promise<UserRole | null>;
declare function getUserProfile(): Promise<{
    user: null;
    profile: null;
} | {
    user: _supabase_supabase_js.AuthUser;
    profile: any;
}>;

export { UserRole, createServerSupabaseClient, getServerUser, getUserProfile, getUserRole, protectRoute, protectRouteByApp, protectRouteByRole };
