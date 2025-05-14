import Link from 'next/link';
import { Locale, defaultLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/server';

export default async function NotFound({
  params: { locale = defaultLocale },
}: {
  params?: { locale?: string };
}) {
  const dict = await getDictionary((locale as Locale) || defaultLocale, 'common');

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">{dict.errors.notFound}</h2>
        <p className="mt-4 text-muted-foreground max-w-md">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          href={`/${locale}`} 
          className="mt-8 inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {dict.actions.back}
        </Link>
      </div>
    </div>
  );
} 