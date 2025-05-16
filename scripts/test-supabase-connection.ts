// @ts-check
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../apps/restaurant/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL of Anon Key is missing');
  process.exit(1);
}

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test de verbinding door de huidige gebruiker op te halen
    console.log('Trying to get current user...');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return;
    }
    
    if (user) {
      console.log('Successfully connected to Supabase Auth!');
      console.log('Current user email:', user.email);
    } else {
      console.log('Successfully connected to Supabase, but no user is currently signed in.');
    }
    
    // Test een eenvoudige query naar de database
    console.log('\nTesting database connection...');
    const { data: versionData, error: versionError } = await supabase.rpc('version');
    
    if (versionError) {
      console.log('Could not get database version:', versionError.message);
    } else {
      console.log('Database version:', versionData);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Voer de test uit
testConnection()
  .catch(error => {
    console.error('Unhandled error in test:', error);
    process.exit(1);
  });
