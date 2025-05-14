// Export roles and types
export * from './types/roles';

// Export server utilities
export { getUser, getUserRole, createClient } from './server';

// Export client utilities
export { createClient as createBrowserClient } from './client';

// Export middleware
export * from './middleware';

// Export authentication actions
export * from './actions';

// Re-export Supabase types for convenience
export type { User, Session } from '@supabase/supabase-js';

// Server-side auth
export * from './server/role-check';

// Client-side auth
export * from './client'; 