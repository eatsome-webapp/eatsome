"use strict";
"use server";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/server.ts
var server_exports = {};
__export(server_exports, {
  APP_ACCESS: () => APP_ACCESS,
  ROLES: () => ROLES,
  ROLE_HIERARCHY: () => ROLE_HIERARCHY,
  createServerSupabaseClient: () => createServerSupabaseClient,
  getServerUser: () => getServerUser,
  getUserProfile: () => getUserProfile,
  getUserRole: () => getUserRole,
  hasAppAccess: () => hasAppAccess,
  hasRequiredRole: () => hasRequiredRole,
  protectRoute: () => protectRoute,
  protectRouteByApp: () => protectRouteByApp,
  protectRouteByRole: () => protectRouteByRole
});
module.exports = __toCommonJS(server_exports);

// src/utils/server-route-guards.ts
var import_navigation = require("next/navigation");
var import_ssr = require("@supabase/ssr");
var import_headers = require("next/headers");

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

// src/utils/server-route-guards.ts
function getServerUser(appName) {
  return __async(this, null, function* () {
    const supabase = (0, import_ssr.createServerClient)(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return __async(this, null, function* () {
              const cookieStore = yield (0, import_headers.cookies)();
              const cookie = cookieStore.get(name);
              return cookie == null ? void 0 : cookie.value;
            });
          },
          set() {
            return __async(this, null, function* () {
            });
          },
          remove() {
            return __async(this, null, function* () {
            });
          }
        }
      }
    );
    const { data: { user } } = yield supabase.auth.getUser();
    if (!user) {
      return { user: null, profile: null, role: null };
    }
    const { data: profile } = yield supabase.from("profiles").select("*").eq("id", user.id).single();
    return {
      user,
      profile,
      role: (profile == null ? void 0 : profile.role) || null
    };
  });
}
function protectRoute(redirectPath = "/login") {
  return __async(this, null, function* () {
    const { user } = yield getServerUser("");
    if (!user) {
      (0, import_navigation.redirect)(redirectPath);
    }
    return user;
  });
}
function protectRouteByRole(requiredRole, appName, redirectPath = "/unauthorized") {
  return __async(this, null, function* () {
    const { user, profile, role } = yield getServerUser(appName);
    if (!user) {
      (0, import_navigation.redirect)("/login");
    }
    if (!role || !hasRequiredRole(role, requiredRole)) {
      (0, import_navigation.redirect)(redirectPath);
    }
    return { user, profile, role };
  });
}
function protectRouteByApp(appName, redirectPath = "/unauthorized") {
  return __async(this, null, function* () {
    const { user, profile, role } = yield getServerUser(appName);
    if (!user) {
      (0, import_navigation.redirect)("/login");
    }
    if (!role) {
      (0, import_navigation.redirect)(redirectPath);
    }
    return { user, profile, role };
  });
}

// src/utils/server-auth.ts
var import_ssr2 = require("@supabase/ssr");
var import_headers2 = require("next/headers");
function createServerSupabaseClient() {
  return __async(this, null, function* () {
    const cookieStore = yield (0, import_headers2.cookies)();
    return (0, import_ssr2.createServerClient)(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return __async(this, null, function* () {
              var _a2;
              return (_a2 = cookieStore.get(name)) == null ? void 0 : _a2.value;
            });
          },
          set() {
            return __async(this, null, function* () {
            });
          },
          remove() {
            return __async(this, null, function* () {
            });
          }
        }
      }
    );
  });
}
function getUserRole() {
  return __async(this, null, function* () {
    const supabase = yield createServerSupabaseClient();
    const { data: { user } } = yield supabase.auth.getUser();
    if (!user) {
      return null;
    }
    const { data: profile } = yield supabase.from("profiles").select("role").eq("id", user.id).single();
    return (profile == null ? void 0 : profile.role) || null;
  });
}
function getUserProfile() {
  return __async(this, null, function* () {
    const supabase = yield createServerSupabaseClient();
    const { data: { user } } = yield supabase.auth.getUser();
    if (!user) {
      return { user: null, profile: null };
    }
    const { data: profile } = yield supabase.from("profiles").select("*").eq("id", user.id).single();
    return { user, profile };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  APP_ACCESS,
  ROLES,
  ROLE_HIERARCHY,
  createServerSupabaseClient,
  getServerUser,
  getUserProfile,
  getUserRole,
  hasAppAccess,
  hasRequiredRole,
  protectRoute,
  protectRouteByApp,
  protectRouteByRole
});
