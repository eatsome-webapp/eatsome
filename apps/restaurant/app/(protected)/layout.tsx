import { ReactNode } from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AuthProvider, createClientSupabaseClient } from 'auth';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/');
  }

  // Fetch the user's profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  // Check if the profile has the right role for Restaurant app
  if (
    profile &&
    !['restaurant_staff', 'restaurant_admin', 'platform_admin'].includes(profile.role)
  ) {
    return redirect('/unauthorized');
  }

  const supabaseClient = createClientSupabaseClient();

  return (
    <AuthProvider supabase={supabaseClient} serverUser={user} serverProfile={profile}>
      <div className='min-h-screen bg-gray-50'>{children}</div>
    </AuthProvider>
  );
}
