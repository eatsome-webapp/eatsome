"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var index_exports = {};
__export(index_exports, {
  APP_ACCESS: () => APP_ACCESS,
  AuthProvider: () => AuthProvider,
  ROLES: () => ROLES,
  ROLE_HIERARCHY: () => ROLE_HIERARCHY,
  RoleGuard: () => RoleGuard,
  createClientSupabaseClient: () => createClientSupabaseClient,
  hasAppAccess: () => hasAppAccess,
  hasRequiredRole: () => hasRequiredRole,
  useAuth: () => useAuth,
  useAuthForm: () => useAuthForm,
  useProtectRoute: () => useProtectRoute,
  useProtectRouteByApp: () => useProtectRouteByApp,
  useProtectRouteByRole: () => useProtectRouteByRole,
  useRoleCheck: () => useRoleCheck
});
module.exports = __toCommonJS(index_exports);

// src/context/auth-context.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var AuthContext = (0, import_react.createContext)(void 0);
var AuthProvider = ({
  children,
  supabase,
  serverUser = null,
  serverProfile = null
}) => {
  const [user, setUser] = (0, import_react.useState)(
    serverUser ? __spreadProps(__spreadValues({}, serverUser), { profile: serverProfile }) : null
  );
  const [profile, setProfile] = (0, import_react.useState)(serverProfile || null);
  const [isLoading, setIsLoading] = (0, import_react.useState)(!serverUser);
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
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const context = (0, import_react.useContext)(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// src/components/role-guard.tsx
var import_react2 = require("react");

// src/utils/roles.ts
var ROLES = {
  CUSTOMER: "customer",
  COURIER: "courier",
  RESTAURANT_STAFF: "restaurant_staff",
  RESTAURANT_ADMIN: "restaurant_admin",
  PLATFORM_ADMIN: "platform_admin"
};
var ROLE_HIERARCHY = {
  customer: ["customer"],
  courier: ["courier"],
  restaurant_staff: ["restaurant_staff"],
  restaurant_admin: ["restaurant_staff", "restaurant_admin"],
  platform_admin: ["restaurant_staff", "restaurant_admin", "platform_admin"]
};
function hasRequiredRole(userRole, requiredRole) {
  return ROLE_HIERARCHY[userRole].includes(requiredRole);
}
var APP_ACCESS = {
  restaurant: ["restaurant_staff", "restaurant_admin", "platform_admin"],
  customer: ["customer", "platform_admin"],
  courier: ["courier", "platform_admin"],
  admin: ["platform_admin"]
};
function hasAppAccess(appName, userRole) {
  var _a;
  if (!userRole) return false;
  return ((_a = APP_ACCESS[appName]) == null ? void 0 : _a.some((role) => hasRequiredRole(userRole, role))) || false;
}

// src/components/role-guard.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var RoleGuard = ({
  requiredRole,
  children,
  fallback = null
}) => {
  const { role, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "animate-pulse h-8 w-full bg-muted rounded" });
  }
  if (!role || !hasRequiredRole(role, requiredRole)) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: fallback });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children });
};

// src/hooks/use-auth-form.ts
var import_react3 = require("react");
var import_navigation = require("next/navigation");
function useAuthForm({
  redirectTo = "/dashboard",
  onSuccess,
  onError
} = {}) {
  const [formState, setFormState] = (0, import_react3.useState)({
    email: "",
    password: "",
    remember: false
  });
  const [isLoading, setIsLoading] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)(null);
  const { signIn } = useAuth();
  const router = (0, import_navigation.useRouter)();
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
var import_navigation2 = require("next/navigation");
function useProtectRoute(redirectPath = "/login") {
  const { user, isLoading } = useAuth();
  const router = (0, import_navigation2.useRouter)();
  if (!isLoading && !user) {
    router.push(redirectPath);
  }
  return { user, isLoading };
}
function useProtectRouteByRole(requiredRole, redirectPath = "/unauthorized") {
  const { user, profile, role, isLoading } = useAuth();
  const router = (0, import_navigation2.useRouter)();
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
  const router = (0, import_navigation2.useRouter)();
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
var import_ssr = require("@supabase/ssr");
function createClientSupabaseClient() {
  return (0, import_ssr.createBrowserClient)(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
