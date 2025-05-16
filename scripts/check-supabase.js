const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/restaurant/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key in environment variables');
  process.exit(1);
}

async function testConnection() {
  console.log('🔌 Testing Supabase connection to:', supabaseUrl);
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Controleer of we verbinding kunnen maken met de auth service
    console.log('\n🔑 Testing Auth service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('ℹ️  Auth session check:', authError.message);
    } else {
      console.log('✅ Auth service is reachable');
      console.log('   Session status:', authData.session ? 'Active session' : 'No active session');
    }
    
    // Test 2: Voer een eenvoudige database query uit
    console.log('\n💾 Testing database connection...');
    try {
      // Probeer de database versie op te halen (werkt altijd, ongeacht RLS)
      const { data: versionData, error: versionError } = await supabase.rpc('version');
      
      if (versionError) throw versionError;
      
      console.log('✅ Database connection successful!');
      console.log('   PostgreSQL version:', versionData);
      
    } catch (dbError) {
      console.error('❌ Database test failed:', dbError.message);
      
      // Als de versie-query mislukt, probeer dan een eenvoudigere test
      console.log('\n🔄 Trying alternative test...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
      if (error) {
        console.error('❌ Alternative test failed:', error.message);
      } else {
        console.log('✅ Alternative test successful! Database is accessible.');
      }
    }
    
    // Test 3: Controleer of we bestanden kunnen ophalen van storage
    console.log('\n📦 Testing Storage service...');
    try {
      const { data: storageData, error: storageError } = await supabase
        .storage
        .listBuckets();
        
      if (storageError) throw storageError;
      
      console.log('✅ Storage service is accessible');
      console.log(`   Found ${storageData.length} buckets`);
      
    } catch (storageError) {
      console.error('❌ Storage test failed:', storageError.message);
    }
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
  }
}

// Voer de tests uit
testConnection()
  .then(() => console.log('\n🏁 Tests completed!'))
  .catch(err => console.error('Unhandled error:', err));
