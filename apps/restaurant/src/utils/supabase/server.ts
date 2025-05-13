import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          return cookieStore.get(name)?.value;
        },
        async set(name, value, options) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // This can happen when attempting to set cookies from a Server Component.
            // The error is expected and won't affect the authentication process thanks to the middleware.
          }
        },
        async remove(name, options) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            // This can happen when attempting to remove cookies from a Server Component.
          }
        },
      },
    }
  );
} 