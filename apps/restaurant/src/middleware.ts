import { createMiddleware, Role } from '@repo/auth';
import { NextRequest } from 'next/server';

// Define route access patterns
const authRoutes = [
  '/(admin)',
  '/(staff)',
];

const publicRoutes = [
  '/staff-login',
  '/api/auth',
];

// Define role-based access for specific route patterns
const roleAccess = {
  '/(admin)': Role.RESTAURANT_ADMIN,
  '/(staff)': Role.RESTAURANT_STAFF
};

// Create the middleware handler
const handler = createMiddleware({
  authRoutes,
  publicRoutes,
  defaultAuthRedirect: '/staff-login',
  roleAccess
});

// Export the middleware handler
export function middleware(request: NextRequest) {
  return handler(request);
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}; 