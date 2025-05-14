import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { Role, hasAccessToRole } from './types/roles';

export const createMiddleware = (options: {
  authRoutes: string[];
  publicRoutes: string[];
  defaultAuthRedirect: string;
  roleAccess?: Record<string, Role>;
}) => {
  return async function middleware(request: NextRequest) {
    const { searchParams, pathname } = new URL(request.url);
    
    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            // This is set on the client, no need to implement here
          },
          remove(name, options) {
            // This is set on the client, no need to implement here
          },
          getAll() {
            return Array.from(request.cookies.getAll());
          },
          setAll(cookiesToSet) {
            // This is set on the client, no need to implement here
          },
        },
      }
    );

    // Refresh the session if expired
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if the route is an auth route (requires authentication)
    const isAuthRoute = options.authRoutes.some(route => 
      pathname.startsWith(route) || pathname === route
    );
    
    // Check if the route is public
    const isPublicRoute = options.publicRoutes.some(route =>
      pathname.startsWith(route) || pathname === route
    );
    
    // If this is an auth route but there's no session, redirect to login
    if (isAuthRoute && !session) {
      const redirectUrl = new URL(options.defaultAuthRedirect, request.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If there's a session, check role-based access for protected routes
    if (session && options.roleAccess) {
      const userRole = session.user.user_metadata.role as Role;
      
      // Check if the current route has role restrictions
      for (const [routePrefix, requiredRole] of Object.entries(options.roleAccess)) {
        if (pathname.startsWith(routePrefix) || pathname === routePrefix) {
          // Check if the user's role has access to this route
          if (!hasAccessToRole(userRole, requiredRole)) {
            // Redirect to forbidden page or dashboard
            return NextResponse.redirect(new URL('/forbidden', request.url));
          }
        }
      }
    }
    
    return NextResponse.next();
  };
}; 