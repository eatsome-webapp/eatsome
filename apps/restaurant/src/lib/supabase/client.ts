'use client';

import { createBrowserClient } from '@supabase/ssr';

// Define Database interface
interface Database {
  // We'll expand this as needed with the actual schema
  public: {
    Tables: Record<string, unknown>;
  }
}

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Import de auth componenten vanuit de component directory
export { AuthProvider, useAuth } from '@/components/auth/AuthProvider'; 