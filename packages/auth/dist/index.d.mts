import * as React from 'react';
import React__default, { ChangeEvent, FormEvent } from 'react';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { P as Profile, U as UserWithProfile, a as UserRole } from './types-DIoM8QhV.mjs';
export { A as APP_ACCESS, R as ROLES, b as ROLE_HIERARCHY, c as hasAppAccess, h as hasRequiredRole } from './types-DIoM8QhV.mjs';

interface AuthContextProps {
    user: UserWithProfile | null;
    profile: Profile | null;
    role: UserRole | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{
        error: any;
    } | undefined>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}
interface AuthProviderProps {
    children: React__default.ReactNode;
    supabase: SupabaseClient;
    serverUser?: User | null;
    serverProfile?: Profile | null;
}
declare const AuthProvider: React__default.FC<AuthProviderProps>;
declare const useAuth: () => AuthContextProps;

interface RoleGuardProps {
    requiredRole: UserRole;
    children: React__default.ReactNode;
    fallback?: React__default.ReactNode;
}
declare const RoleGuard: React__default.FC<RoleGuardProps>;

interface UseAuthFormProps {
    redirectTo?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}
interface FormState {
    email: string;
    password: string;
    remember: boolean;
}
declare function useAuthForm({ redirectTo, onSuccess, onError }?: UseAuthFormProps): {
    formState: FormState;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

declare function useRoleCheck(): {
    role: UserRole | null;
    checkRole: (requiredRole: UserRole) => boolean;
    isCustomer: boolean;
    isCourier: boolean;
    isRestaurantStaff: boolean;
    isRestaurantAdmin: boolean;
    isPlatformAdmin: boolean;
    hasRestaurantAccess: boolean;
    hasCustomerAccess: boolean;
    hasCourierAccess: boolean;
    hasAdminAccess: boolean;
};

declare function useProtectRoute(redirectPath?: string): {
    user: UserWithProfile | null;
    isLoading: boolean;
};
declare function useProtectRouteByRole(requiredRole: UserRole, redirectPath?: string): {
    user: UserWithProfile | null;
    profile: Profile | null;
    role: UserRole | null;
    isLoading: boolean;
};
declare function useProtectRouteByApp(appName: string, redirectPath?: string): {
    user: UserWithProfile | null;
    profile: Profile | null;
    role: UserRole | null;
    isLoading: boolean;
};

declare function createClientSupabaseClient(): _supabase_supabase_js.SupabaseClient<any, "public", any>;

export { AuthProvider, Profile, RoleGuard, UserRole, UserWithProfile, createClientSupabaseClient, useAuth, useAuthForm, useProtectRoute, useProtectRouteByApp, useProtectRouteByRole, useRoleCheck };
