'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@repo/database';

// Specifiek voor gebruik in Server Actions
export async function createActionClient() {
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
          } catch (error) {
            console.error('Failed to set cookie in Server Action:', error);
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
            console.error('Failed to remove cookie in Server Action:', error);
          }
        },
      },
    }
  );
}

// Veilige manier om gebruiker op te halen in server actions
export async function getUserInAction() {
  const supabase = await createActionClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user in server action:', error);
    return null;
  }
} 