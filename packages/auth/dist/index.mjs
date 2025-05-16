import {
  APP_ACCESS,
  ROLES,
  ROLE_HIERARCHY,
  __async,
  __spreadProps,
  __spreadValues,
  hasAppAccess,
  hasRequiredRole
} from "./chunk-3IXJTIYC.mjs";

// src/context/auth-context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
var AuthContext = createContext(void 0);
var AuthProvider = ({
  children,
  supabase,
  serverUser = null,
  serverProfile = null
}) => {
  const [user, setUser] = useState(
    serverUser ? __spreadProps(__spreadValues({}, serverUser), { profile: serverProfile }) : null
  );
  const [profile, setProfile] = useState(serverProfile || null);
  const [isLoading, setIsLoading] = useState(!serverUser);
  const getUserProfile = (userId) => __async(null, null, function* () {
    try {
      const { data, error } = yield supabase.from("profiles").select("*").eq("id", userId).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  });
  const refreshUser = () => __async(null, null, function* () {
    try {
      setIsLoading(true);
      const { data: { user: freshUser }, error } = yield supabase.auth.getUser();
      if (error || !freshUser) {
        setUser(null);
        setProfile(null);
        return;
      }
      const freshProfile = yield getUserProfile(freshUser.id);
      setUser(__spreadProps(__spreadValues({}, freshUser), { profile: freshProfile }));
      setProfile(freshProfile);
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  });
  useEffect(() => {
    if (!serverUser) {
      refreshUser();
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => __async(null, null, function* () {
        if (session == null ? void 0 : session.user) {
          const profile2 = yield getUserProfile(session.user.id);
          setUser(__spreadProps(__spreadValues({}, session.user), { profile: profile2 }));
          setProfile(profile2);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      })
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, serverUser]);
  const signIn = (email, password) => __async(null, null, function* () {
    try {
      const { error } = yield supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) return { error };
    } catch (error) {
      return { error };
    }
  });
  const signOut = () => __async(null, null, function* () {
    yield supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  });
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        profile,
        role: (profile == null ? void 0 : profile.role) || null,
        isLoading,
        signIn,
        signOut,
        refreshUser
      },
      children
    }
  );
};
var useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// src/components/role-guard.tsx
import "react";
import { Fragment, jsx as jsx2 } from "react/jsx-runtime";
var RoleGuard = ({
  requiredRole,
  children,
  fallback = null
}) => {
  const { role, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ jsx2("div", { className: "animate-pulse h-8 w-full bg-muted rounded" });
  }
  if (!role || !hasRequiredRole(role, requiredRole)) {
    return /* @__PURE__ */ jsx2(Fragment, { children: fallback });
  }
  return /* @__PURE__ */ jsx2(Fragment, { children });
};

// src/hooks/use-auth-form.ts
import { useState as useState2 } from "react";
import { useRouter } from "next/navigation";
function useAuthForm({
  redirectTo = "/dashboard",
  onSuccess,
  onError
} = {}) {
  const [formState, setFormState] = useState2({
    email: "",
    password: "",
    remember: false
  });
  const [isLoading, setIsLoading] = useState2(false);
  const [error, setError] = useState2(null);
  const { signIn } = useAuth();
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => __spreadProps(__spreadValues({}, prev), {
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleSubmit = (e) => __async(null, null, function* () {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { email, password } = formState;
      const result = yield signIn(email, password);
      if (result == null ? void 0 : result.error) {
        setError(result.error.message);
        onError == null ? void 0 : onError(result.error);
        return;
      }
      onSuccess == null ? void 0 : onSuccess();
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
      onError == null ? void 0 : onError(err);
    } finally {
      setIsLoading(false);
    }
  });
  return {
    formState,
    handleChange,
    handleSubmit,
    isLoading,
    error,
    setError
  };
}

// src/hooks/use-role-check.ts
function useRoleCheck() {
  const { role } = useAuth();
  const checkRole = (requiredRole) => {
    if (!role) return false;
    return hasRequiredRole(role, requiredRole);
  };
  return {
    role,
    checkRole,
    isCustomer: role === "customer",
    isCourier: role === "courier",
    isRestaurantStaff: role === "restaurant_staff",
    isRestaurantAdmin: role === "restaurant_admin",
    isPlatformAdmin: role === "platform_admin",
    // Check if user has access to Restaurant app
    hasRestaurantAccess: role === "restaurant_staff" || role === "restaurant_admin" || role === "platform_admin",
    // Check if user has access to Customer app
    hasCustomerAccess: role === "customer" || role === "platform_admin",
    // Check if user has access to Courier app
    hasCourierAccess: role === "courier" || role === "platform_admin",
    // Check if user has access to Admin app
    hasAdminAccess: role === "platform_admin"
  };
}

// src/utils/route-guards.ts
import { useRouter as useRouter2 } from "next/navigation";
function useProtectRoute(redirectPath = "/login") {
  const { user, isLoading } = useAuth();
  const router = useRouter2();
  if (!isLoading && !user) {
    router.push(redirectPath);
  }
  return { user, isLoading };
}
function useProtectRouteByRole(requiredRole, redirectPath = "/unauthorized") {
  const { user, profile, role, isLoading } = useAuth();
  const router = useRouter2();
  if (!isLoading) {
    if (!user) {
      router.push("/login");
      return { user: null, profile: null, role: null, isLoading };
    }
    if (!role || !hasRequiredRole(role, requiredRole)) {
      router.push(redirectPath);
    }
  }
  return { user, profile, role, isLoading };
}
function useProtectRouteByApp(appName, redirectPath = "/unauthorized") {
  const { user, profile, role, isLoading } = useAuth();
  const router = useRouter2();
  if (!isLoading) {
    if (!user) {
      router.push("/login");
      return { user: null, profile: null, role: null, isLoading };
    }
    if (!role) {
      router.push(redirectPath);
    }
  }
  return { user, profile, role, isLoading };
}

// src/utils/client-auth.ts
import { createBrowserClient } from "@supabase/ssr";
function createClientSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
export {
  APP_ACCESS,
  AuthProvider,
  ROLES,
  ROLE_HIERARCHY,
  RoleGuard,
  createClientSupabaseClient,
  hasAppAccess,
  hasRequiredRole,
  useAuth,
  useAuthForm,
  useProtectRoute,
  useProtectRouteByApp,
  useProtectRouteByRole,
  useRoleCheck
};
