import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Set cookie on the response so it will be used for client-side routing
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          // Remove cookie from the response
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // This will refresh the session if it exists
  await supabase.auth.getUser();

  return response;
}

export function createMiddleware(config?: {
  publicRoutes?: string[];
  authRoutes?: string[];
  defaultRedirectPath?: string;
  loginRedirectPath?: string;
}) {
  const {
    publicRoutes = ['/auth/error', '/auth/confirm'],
    authRoutes = ['/auth/login', '/auth/signup', '/auth/reset-password'],
    defaultRedirectPath = '/dashboard',
    loginRedirectPath = '/auth/login',
  } = config || {};

  return async function middleware(request: NextRequest) {
    const res = await updateSession(request);
    
    const path = request.nextUrl.pathname;
    
    const isPublicRoute = publicRoutes.some(route => 
      path.startsWith(route) || 
      path.startsWith('/_next') || 
      path.includes('favicon') || 
      path === '/'
    );
    
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set() {}, // No-op since we're just reading
          remove() {} // No-op since we're just reading
        }
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user && !isPublicRoute && !isAuthRoute) {
      const redirectUrl = new URL(loginRedirectPath, request.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL(defaultRedirectPath, request.url));
    }
    
    return res;
  };
}

// Example middleware integration:
// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }
// 
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }; 