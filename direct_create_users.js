// Direct user creation script using service role key
// Save this file, then run with: node direct_create_users.js

const fetch = require('node-fetch');

// Vervang deze met je werkelijke SERVICE_ROLE key uit het Supabase dashboard
const SUPABASE_URL = 'https://xplxxwodtmlrqrifvlcj.supabase.co';
const SERVICE_ROLE_KEY = ''; // Vul je service role key in (te vinden in Supabase dashboard -> Project Settings -> API)

async function createUserWithServiceRole(email, password, role) {
  console.log(`Trying to create user: ${email} with role: ${role}`);
  
  try {
    // Stap 1: Maak een gebruiker aan met de service role key
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true, // Direct bevestigd
        user_metadata: { name: email.split('@')[0] },
        app_metadata: { role }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error(`Error creating user ${email}:`, data.error);
      
      // Check if the user already exists
      if (data.error.message.includes('already exists')) {
        console.log(`User ${email} already exists. Trying to update role...`);
        return await updateUserRole(email, role);
      }
      
      return null;
    }
    
    console.log(`Successfully created user ${email}:`, data);
    
    // Stap 2: Maak handmatig een profiel aan (als fallback voor de trigger)
    if (data.id) {
      try {
        await createProfile(data.id, email.split('@')[0]);
      } catch (profileError) {
        console.error(`Error creating profile for ${email}:`, profileError);
        // Niet fataal, we gaan door
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Unexpected error creating user ${email}:`, error);
    return null;
  }
}

async function updateUserRole(email, role) {
  console.log(`Updating role for user ${email} to ${role}`);
  
  try {
    // Eerst de gebruiker ophalen om het ID te krijgen
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    const users = await userResponse.json();
    
    if (!users || users.length === 0) {
      console.error(`User ${email} not found`);
      return null;
    }
    
    const userId = users[0].id;
    
    // Update de rol
    const updateResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        app_metadata: { role }
      })
    });
    
    const updateData = await updateResponse.json();
    
    if (updateData.error) {
      console.error(`Error updating role for ${email}:`, updateData.error);
      return null;
    }
    
    console.log(`Successfully updated role for ${email} to ${role}`);
    
    // Check if profile exists, create if not
    try {
      await createProfile(userId, email.split('@')[0]);
    } catch (profileError) {
      console.error(`Error ensuring profile for ${email}:`, profileError);
      // Niet fataal, we gaan door
    }
    
    return updateData;
  } catch (error) {
    console.error(`Unexpected error updating role for ${email}:`, error);
    return null;
  }
}

async function createProfile(userId, displayName) {
  console.log(`Creating/ensuring profile for user ${userId}`);
  
  try {
    // Controleer eerst of het profiel al bestaat
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    const existingProfiles = await checkResponse.json();
    
    if (existingProfiles && existingProfiles.length > 0) {
      console.log(`Profile for ${userId} already exists`);
      return existingProfiles[0];
    }
    
    // Profiel aanmaken
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: userId,
        full_name: displayName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error(`Error creating profile:`, data.error);
      return null;
    }
    
    console.log(`Successfully created profile for ${userId}`);
    return data;
  } catch (error) {
    console.error(`Unexpected error creating profile for ${userId}:`, error);
    throw error; // We gooien de error door zodat de aanroeper weet dat er iets mis ging
  }
}

async function main() {
  // Admin gebruiker
  await createUserWithServiceRole('kocamis.emre@gmail.com', 'Welkom123!', 'admin');
  
  // Customer gebruiker
  await createUserWithServiceRole('emre___1989@hotmail.com', 'kocamis40', 'customer');
  
  // Restaurant gebruiker (als deze nog niet bestaat)
  // Als deze gebruiker al bestaat, je kunt hem updaten via de Supabase dashboard
  await createUserWithServiceRole('emre.kocamis@hotmail.com', 'Welkom123!', 'restaurant_owner');
}

main().catch(console.error); 