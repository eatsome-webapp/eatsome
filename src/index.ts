// Auth package index file

// Export types
export * from './types';

// We don't export client/server modules directly from here
// to avoid mixing client and server code in the same bundle.
// Instead, import from:
// - '@eatsome/auth/client' - for client components
// - '@eatsome/auth/server' - for server components
// - '@eatsome/auth/middleware' - for middleware

// Export middleware for direct import
export * from './middleware'; 