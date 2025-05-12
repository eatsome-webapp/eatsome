# Supabase Authentication Setup for Eatsome

This guide explains how to set up Supabase authentication for the Eatsome platform using Next.js 15.

## Environment Variables

Add the following environment variables to your `.env.local` file in the root directory:

```bash
# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Redirects

For email verification and OAuth authentication to work properly, you need to configure the following redirect URLs in your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to Authentication > URL Configuration
3. Set the following URLs:

- **Site URL**: `http://localhost:3000` (or your production URL)
- **Redirect URLs**:
  - `http://localhost:3001/auth/confirm`
  - `http://localhost:3002/auth/confirm`
  - `http://localhost:3003/auth/confirm`
  - `http://localhost:3001/auth/callback`
  - `http://localhost:3002/auth/callback`
  - `http://localhost:3003/auth/callback`

For production, add your actual domain URLs following the same pattern.

## Database Schema and RLS Policies

The authentication system relies on several tables with Row Level Security policies:

1. `profiles` - Stores user profile information
2. `restaurants` - Restaurant details
3. `restaurant_staff` - Links staff members to restaurants with roles
4. `menu_categories` - Restaurant menu categories
5. `menu_items` - Restaurant menu items
6. `restaurant_tables` - Tables in restaurants
7. `orders` - Customer orders
8. `order_items` - Items in customer orders

RLS policies ensure that:
- Restaurant staff can only access data for their restaurant
- Customers can only access their own orders
- Admin users have broader access based on their roles

## Testing Authentication

Each app includes a debug page for testing authentication:

- Restaurant app: `/debug/auth`
- Customer app: `/debug/auth`
- Admin app: `/debug/auth`

Visit these pages to test sign-up, sign-in, and view authentication status.

## Common Issues

### Next.js 15 Cookie Issues

Next.js 15 requires awaiting the `cookies()` function. If you encounter errors, ensure you're using:

```typescript
const cookieStore = await cookies();
```

### Middleware Issues

If authentication isn't working as expected, check the middleware configuration for each app in `src/middleware.ts`.

### Email Verification

For local development, you may need to check the Supabase dashboard emails tab to find verification links.

## Custom Authentication Components

The auth package provides these key components:

- `AuthProvider` - Provides authentication context
- `useAuth` - Hook for accessing auth functionality
- `createServerComponentClient` - For server-side auth operations
- Middleware functions for route protection

## Shared Auth Package

This implementation uses a shared `@eatsome/auth` package that includes:

- Server-side utilities
- Client-side components
- TypeScript types
- Middleware functionality

This ensures consistent authentication behavior across all three apps. 