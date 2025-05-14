import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

// Specifiek voor gebruik in Route Handlers
export async function createRouteHandlerClient(request: NextRequest) {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
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
          } catch (error) {
            console.error('Failed to set cookie in Route Handler:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({
              name,
              domain: options.domain,
              path: options.path
            });
          } catch (error) {
            console.error('Failed to remove cookie in Route Handler:', error);
          }
        },
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ 
                name, 
                value, 
                path: options?.path ?? '/',
                domain: options?.domain,
                maxAge: options?.maxAge,
                httpOnly: options?.httpOnly,
                secure: options?.secure,
                sameSite: options?.sameSite,
              });
            });
          } catch (error) {
            console.error('Failed to set multiple cookies in Route Handler:', error);
          }
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
  const supabase = await createRouteHandlerClient(request);
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user in route handler:', error);
    return null;
  }
}

// Helper functie voor authenticatie in Route Handlers
export async function authRouteHandler(
  request: NextRequest,
  callback: (user: any, supabase: any) => Promise<NextResponse>
) {
  const supabase = await createRouteHandlerClient(request);
  
  // Gebruik altijd getUser() in plaats van getSession() in server code
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Niet geautoriseerd' },
      { status: 401 }
    );
  }
  
  return callback(user, supabase);
} 