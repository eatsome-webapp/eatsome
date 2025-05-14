'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { Role, hasAccessToRole, ROLE_COOKIES, ROLE_REDIRECT_URLS } from './types/roles';

// Define app route prefixes for each role
const APP_ROUTES = {
  [Role.CUSTOMER]: ['/', '/restaurants', '/orders', '/profile', '/favorites'],
  [Role.COURIER]: ['/courier'],
  [Role.RESTAURANT_STAFF]: ['/staff'],
  [Role.RESTAURANT_ADMIN]: ['/admin/restaurant'],
  [Role.PLATFORM_ADMIN]: ['/admin/platform'],
};

/**
 * Updates the session by refreshing the access token if expired
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set(name, value);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value);
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.delete(name);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete(name);
        }
      }
    }
  );
  
  // This will refresh the user's session and get a new access token
  await supabase.auth.getUser();
  
  return response;
}

/**
 * Creates a middleware function with route protection and token refresh
 */
export async function createMiddleware(options: {
  authRoutes: string[];
  publicRoutes: string[];
  defaultAuthRedirect: string;
  roleAccess?: Record<string, Role>;
}) {
  return async function middleware(request: NextRequest) {
    // First refresh the session
    const response = await updateSession(request);
    
    const { searchParams, pathname } = new URL(request.url);
    
    // Skip middleware for static files and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/assets') ||
      pathname.startsWith('/api/public')
    ) {
      return response;
    }
    
    // Create a Supabase client for route protection
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Token refresh is handled by updateSession
          },
          remove(name: string, options: CookieOptions) {
            // Token refresh is handled by updateSession
          }
        }
      }
    );

    // IMPORTANT: Always use getUser() to validate the auth token, never getSession()
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // Check if the route is an auth route (requires authentication)
    const isAuthRoute = options.authRoutes.some(route => 
      pathname.startsWith(route) || pathname === route
    );
    
    // Check if the route is public (no auth required)
    const isPublicRoute = options.publicRoutes.some(route => 
      pathname.startsWith(route) || pathname === route
    );
    
    // If this is an auth route but there's no user, redirect to login
    if (isAuthRoute && (!user || error)) {
      // Determine the appropriate login route based on the requested path
      const routeType = getRouteTypeFromPath(pathname);
      const loginPath = routeType ? ROLE_REDIRECT_URLS[routeType] : options.defaultAuthRedirect;
      
      const redirectUrl = new URL(loginPath, request.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If there's a user, check role-based access for protected routes
    if (user) {
      // Determine the user's role based on cookies and metadata
      let userRole: Role;
      
      // First check role cookies (from highest to lowest privilege)
      if (request.cookies.has(ROLE_COOKIES[Role.PLATFORM_ADMIN])) {
        userRole = Role.PLATFORM_ADMIN;
      } else if (request.cookies.has(ROLE_COOKIES[Role.RESTAURANT_ADMIN])) {
        userRole = Role.RESTAURANT_ADMIN;
      } else if (request.cookies.has(ROLE_COOKIES[Role.RESTAURANT_STAFF])) {
        userRole = Role.RESTAURANT_STAFF;
      } else if (request.cookies.has(ROLE_COOKIES[Role.COURIER])) {
        userRole = Role.COURIER;
      } else if (request.cookies.has(ROLE_COOKIES[Role.CUSTOMER])) {
        userRole = Role.CUSTOMER;
      } else {
        // If no role cookie is found, use the role from user metadata
        userRole = (user.user_metadata.role as Role) || Role.CUSTOMER;
        
        // Set the corresponding cookie
        response.cookies.set({
          name: ROLE_COOKIES[userRole],
          value: 'true',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      }
      
      // Check role-specific access
      if (options.roleAccess) {
        // Check if the current route has role restrictions
        for (const [routePrefix, requiredRole] of Object.entries(options.roleAccess)) {
          if (pathname.startsWith(routePrefix) || pathname === routePrefix) {
            // Check if the user's role has access to this route
            if (!hasAccessToRole(userRole, requiredRole)) {
              // Redirect to forbidden page
              return NextResponse.redirect(new URL('/forbidden', request.url));
            }
          }
        }
      }
      
      // Additional check for app-specific route types
      const routeType = getRouteTypeFromPath(pathname);
      if (routeType && routeType !== Role.CUSTOMER) {
        const hasAccess = hasAccessToRole(userRole, routeType);
        if (!hasAccess) {
          // Redirect to forbidden page
          return NextResponse.redirect(new URL('/forbidden', request.url));
        }
      }
    }
    
    return response;
  };
}

// Helper function to determine route type based on pathname
function getRouteTypeFromPath(pathname: string): Role | null {
  for (const [role, prefixes] of Object.entries(APP_ROUTES)) {
    if (prefixes.some(prefix => pathname.startsWith(prefix))) {
      return role as Role;
    }
  }
  return null;
} 