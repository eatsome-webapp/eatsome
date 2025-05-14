'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@repo/database';

// Specifiek voor gebruik in Server Actions
export async function createActionClient() {
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
            console.error('Failed to set multiple cookies in Server Action:', error);
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

// Server Action functie voor het inloggen van gebruikers
export async function signIn(formData: FormData) {
  const supabase = await createActionClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string || '/dashboard';

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  // Redirect naar de dashboard pagina als inloggen succesvol is
  redirect(redirectTo);
}

// Server Action functie voor het registreren van gebruikers
export async function signUp(formData: FormData) {
  const supabase = await createActionClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    message: 'Een bevestigingslink is naar je e-mail verzonden. Klik op de link om je registratie te voltooien.'
  };
}

// Server Action functie voor het uitloggen van gebruikers
export async function signOut() {
  const supabase = await createActionClient();
  await supabase.auth.signOut();
  redirect('/login');
} 