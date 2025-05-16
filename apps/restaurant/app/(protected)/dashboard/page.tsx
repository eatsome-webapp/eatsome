import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Gebruik getUser in plaats van getSession voor meer veiligheid
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  // Haal het profiel op om te controleren of de gebruiker de juiste rol heeft
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (
    !profile ||
    !['restaurant_staff', 'restaurant_admin', 'platform_admin'].includes(profile.role)
  ) {
    redirect('/unauthorized');
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <p className='mb-4'>
          Welkom bij het restaurant dashboard, {profile.full_name || data.user.email}
        </p>
        <div className='bg-gray-50 p-4 rounded-md'>
          <h2 className='font-medium mb-2'>Gebruikersgegevens:</h2>
          <p>
            <strong>Email:</strong> {data.user.email}
          </p>
          <p>
            <strong>Rol:</strong> {profile.role}
          </p>
          {profile.restaurant_id && (
            <p>
              <strong>Restaurant ID:</strong> {profile.restaurant_id}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
