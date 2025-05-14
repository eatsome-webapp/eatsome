import { Inter, Poppins, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@repo/ui/components/ui/toaster';
import { Locale, locales, getDefaultLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/server';
import { notFound } from 'next/navigation';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

import '../globals.css';

// Fonts setup - 70% Poppins, 30% Montserrat
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Valideer locale
  if (!locales.includes(locale as Locale)) {
    return {
      title: 'Food Platform',
      description: 'All-in-One Food Platform',
    };
  }

  // Laad de vertalingen voor metadata
  const t = await getDictionary(locale as Locale, 'common');

  return {
    title: {
      default: 'Food Platform',
      template: '%s | Food Platform',
    },
    description: 'All-in-One Food Platform',
    keywords: ['food', 'delivery', 'restaurant', 'foodtruck', 'takeaway', 'dining'],
    authors: [
      {
        name: 'Your Name',
        url: 'https://yourwebsite.com',
      },
    ],
    creator: 'Your Name',
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Valideer locale of gebruik standaard lokale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Laad de vertalingen
  const dict = await getDictionary(locale as Locale, 'common');

  return (
    <html lang={locale} suppressHydrationWarning className={`${poppins.variable} ${montserrat.variable}`}>
      <head>
        <style jsx global>{`
          :root {
            --font-primary: ${poppins.style.fontFamily};
            --font-secondary: ${montserrat.style.fontFamily};
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-background font-primary antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main>
            <div className="absolute top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            {/* Geef vertaalwoordenboek door aan alle componenten via data attributen */}
            <div data-dictionary={JSON.stringify(dict)}>
              {children}
            </div>
          </main>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const dynamicParams = true;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
} 