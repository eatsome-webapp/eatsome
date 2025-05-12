// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
async function updateSession(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0
          });
        }
      }
    }
  );
  await supabase.auth.getUser();
  return response;
}
function createMiddleware(config) {
  const {
    publicRoutes = ["/auth/error", "/auth/confirm"],
    authRoutes = ["/auth/login", "/auth/signup", "/auth/reset-password"],
    defaultRedirectPath = "/dashboard",
    loginRedirectPath = "/auth/login"
  } = config || {};
  return async function middleware(request) {
    const res = await updateSession(request);
    const path = request.nextUrl.pathname;
    const isPublicRoute = publicRoutes.some(
      (route) => path.startsWith(route) || path.startsWith("/_next") || path.includes("favicon") || path === "/"
    );
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set() {
          },
          // No-op since we're just reading
          remove() {
          }
          // No-op since we're just reading
        }
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !isPublicRoute && !isAuthRoute) {
      const redirectUrl = new URL(loginRedirectPath, request.url);
      redirectUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(redirectUrl);
    }
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL(defaultRedirectPath, request.url));
    }
    return res;
  };
}

export {
  updateSession,
  createMiddleware
};
//# sourceMappingURL=chunk-77C63CUY.mjs.map