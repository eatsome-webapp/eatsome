import { createMiddleware, Role } from '@repo/auth';
import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale, isValidLocale } from './i18n/config';

// Define route access patterns
const PUBLIC_ROUTES = [
  '/[locale]/(auth)/staff-login*',
  '/[locale]/(auth)/login*',
  '/forbidden*'
];

const STAFF_ROUTES = [
  '/[locale]/(staff)/orders*',
  '/[locale]/(staff)/kitchen*',
  '/[locale]/(staff)/tables*'
];

const ADMIN_ROUTES = [
  '/[locale]/(admin)/dashboard*',
  '/[locale]/(admin)/menu*',
  '/[locale]/(admin)/orders*',
  '/[locale]/(admin)/settings*'
];

let handler: Awaited<ReturnType<typeof createMiddleware>>;

function getLocale(request: NextRequest): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  // @ts-ignore locales are readonly
  const locale = matchLocale(languages, locales, defaultLocale);

  return locale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip locale handling for specific static paths
  const skipLocaleRedirect = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('/favicon.ico');

  if (!skipLocaleRedirect) {
    // Extract the locale part from the pathname if it exists
    const pathnameParts = pathname.split('/').filter(Boolean);
    const firstPathPart = pathnameParts[0];
    const pathWithoutLocale = pathnameParts.slice(isValidLocale(firstPathPart) ? 1 : 0).join('/');
    
    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = !isValidLocale(firstPathPart);

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      // Get the preferred locale from the request headers
      const locale = getLocale(request);
      
      // Redirect to the URL with locale
      return NextResponse.redirect(
        new URL(`/${locale}/${pathWithoutLocale}`, request.url)
      );
    }

    // Handle cases where a user manually enters an invalid locale in the URL
    if (firstPathPart && !isValidLocale(firstPathPart)) {
      // Redirect to the default locale
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/${pathWithoutLocale}`, request.url)
      );
    }
  }

  // Initialize auth middleware on first request
  if (!handler) {
    handler = await createMiddleware({
      publicRoutes: PUBLIC_ROUTES,
      roleRoutes: {
        [Role.RESTAURANT_STAFF]: STAFF_ROUTES,
        [Role.RESTAURANT_ADMIN]: [...STAFF_ROUTES, ...ADMIN_ROUTES],
        [Role.PLATFORM_ADMIN]: [...STAFF_ROUTES, ...ADMIN_ROUTES],
      },
      loginPath: '/[locale]/(auth)/staff-login',
      forbiddenPath: '/forbidden',
    });
  }

  // Check auth after handling locale
  return handler(request);
}

export const config = {
  // Matcher ignoring specific paths
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 