'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@repo/database';

export function createClient() {
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
          } catch {
            // Als het in een Server Component draait, negeer de fout
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({
              name,
              domain: options.domain,
              path: options.path
            });
          } catch {
            // Als het in een Server Component draait, negeer de fout
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
          } catch {
            // Als het in een Server Component draait, negeer de fout
          }
        },
      },
    }
  );
}

// Admin client met service role voor server-side operaties die RLS omzeilen
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

// Verkrijg gebruiker server-side - ALTIJD gebruiken in server code
export async function getUser() {
  const supabase = createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
} 