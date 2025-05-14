import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

// Specifiek voor gebruik in Route Handlers
export function createRouteHandlerClient(request: NextRequest) {
  const cookieStore = cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            path: options.path ?? '/',
            domain: options.domain,
            maxAge: options.maxAge,
            httpOnly: options.httpOnly,
            secure: options.secure,
            sameSite: options.sameSite,
          });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({
            name,
            domain: options.domain,
            path: options.path
          });
        },
      },
    }
  );
}

// Verwerkt route handler response en voegt eventuele cookies toe
export function handleRouteResponse(response: NextResponse) {
  return response;
}

// Veilige manier om gebruiker op te halen in route handlers
export async function getUserInRouteHandler(request: NextRequest) {
  const supabase = createRouteHandlerClient(request);
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user in route handler:', error);
    return null;
  }
} 