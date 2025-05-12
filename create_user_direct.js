// Script om direct gebruikers aan te maken via de Supabase API
async function createUser(email, password, role) {
  const SUPABASE_URL = 'https://xplxxwodtmlrqrifvlcj.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbHh4d29kdG1scnFyaWZ2bGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTE2ODgsImV4cCI6MjA2MjQ2NzY4OH0.LMG2XMF0FLwYUKOCssw2e4StSfkxqCedv6QP207613I';

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        email,
        password,
        data: { role }
      })
    });

    const data = await response.json();
    console.log('Resultaat:', data);
    
    if (data.error) {
      console.error('Fout bij aanmaken gebruiker:', data.error);
    } else {
      console.log('Gebruiker aangemaakt:', data.user);
    }
    
    return data;
  } catch (error) {
    console.error('Onverwachte fout:', error);
    return { error };
  }
}

// Gebruikers aanmaken
async function main() {
  console.log('Admin gebruiker aanmaken...');
  await createUser('kocamis.emre@gmail.com', 'Welkom123!', 'admin');
  
  console.log('\nCustomer gebruiker aanmaken...');
  await createUser('emre___1989@hotmail.com', 'kocamis40', 'customer');
  
  console.log('\nRestaurant gebruiker aanmaken...');
  await createUser('restaurant@example.com', 'Welkom123!', 'restaurant_owner');
}

// Script uitvoeren
main(); 