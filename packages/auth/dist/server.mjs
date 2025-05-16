"use server";
import {
  APP_ACCESS,
  ROLES,
  ROLE_HIERARCHY,
  __async,
  hasAppAccess,
  hasRequiredRole
} from "./chunk-3IXJTIYC.mjs";

// src/utils/server-route-guards.ts
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
function getServerUser(appName) {
  return __async(this, null, function* () {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return __async(this, null, function* () {
              const cookieStore = yield cookies();
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
      redirect(redirectPath);
    }
    return user;
  });
}
function protectRouteByRole(requiredRole, appName, redirectPath = "/unauthorized") {
  return __async(this, null, function* () {
    const { user, profile, role } = yield getServerUser(appName);
    if (!user) {
      redirect("/login");
    }
    if (!role || !hasRequiredRole(role, requiredRole)) {
      redirect(redirectPath);
    }
    return { user, profile, role };
  });
}
function protectRouteByApp(appName, redirectPath = "/unauthorized") {
  return __async(this, null, function* () {
    const { user, profile, role } = yield getServerUser(appName);
    if (!user) {
      redirect("/login");
    }
    if (!role) {
      redirect(redirectPath);
    }
    return { user, profile, role };
  });
}

// src/utils/server-auth.ts
import { createServerClient as createServerClient2 } from "@supabase/ssr";
import { cookies as cookies2 } from "next/headers";
function createServerSupabaseClient() {
  return __async(this, null, function* () {
    const cookieStore = yield cookies2();
    return createServerClient2(
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
export {
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
};
