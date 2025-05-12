"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/middleware.ts
var _ssr = require('@supabase/ssr');
var _server = require('next/server');
async function updateSession(request) {
  let response = _server.NextResponse.next({
    request: {
      headers: request.headers
    }
  });
  const supabase = _ssr.createServerClient.call(void 0, 
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return _optionalChain([request, 'access', _ => _.cookies, 'access', _2 => _2.get, 'call', _3 => _3(name), 'optionalAccess', _4 => _4.value]);
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
    const supabase = _ssr.createServerClient.call(void 0, 
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return _optionalChain([request, 'access', _5 => _5.cookies, 'access', _6 => _6.get, 'call', _7 => _7(name), 'optionalAccess', _8 => _8.value]);
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
      return _server.NextResponse.redirect(redirectUrl);
    }
    if (user && isAuthRoute) {
      return _server.NextResponse.redirect(new URL(defaultRedirectPath, request.url));
    }
    return res;
  };
}




exports.updateSession = updateSession; exports.createMiddleware = createMiddleware;
//# sourceMappingURL=chunk-QMPRC4LG.js.map