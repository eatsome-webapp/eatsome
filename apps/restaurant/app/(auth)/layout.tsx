import { ReactNode } from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { createClientSupabaseClient, AuthProvider } from 'auth';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in, redirect to dashboard
  if (user) {
    return redirect('/dashboard');
  }

  const supabaseClient = createClientSupabaseClient();

  return (
    <AuthProvider supabase={supabaseClient} serverUser={null} serverProfile={null}>
      <div className='min-h-screen bg-gray-50'>{children}</div>
    </AuthProvider>
  );
}
