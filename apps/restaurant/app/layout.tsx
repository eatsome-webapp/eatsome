import '../styles/tailwind.css';
import type { Metadata, Viewport } from 'next';
import { Poppins, Montserrat } from 'next/font/google';
import ClientProviders from '../components/client-providers';
import * as React from 'react';

type PropsWithChildren = {
  children: React.ReactNode;
};

// Load Poppins font with variable font support
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  adjustFontFallback: false, // Let Next.js handle fallback fonts
});

// Load Montserrat font with variable font support
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
  adjustFontFallback: false, // Let Next.js handle fallback fonts
});

export const metadata: Metadata = {
  title: {
    default: 'EatSome - All-in-One Food Platform',
    template: '%s | EatSome',
  },
  description: 'Manage your restaurant operations, orders, and delivery in one place.',
  keywords: ['restaurant', 'food delivery', 'restaurant management', 'EatSome'],
  authors: [{ name: 'EatSome Team' }],
  creator: 'EatSome',
  publisher: 'EatSome',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

interface RootLayoutProps extends PropsWithChildren {
  [key: string]: any; // Allow additional props
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`${poppins.variable} ${montserrat.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical CSS for fonts */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-sans: '${poppins.style.fontFamily.replace(/"/g, '')}';
              --font-heading: '${montserrat.style.fontFamily.replace(/"/g, '')}';
            }
            
            body {
              font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: var(--font-heading), system-ui, -apple-system, sans-serif;
            }
          `
        }} />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ClientProviders serverUser={null} serverProfile={null}>
          {React.Children.toArray(children).find((child): child is React.ReactElement => 
            React.isValidElement(child)
          ) || <div />}
        </ClientProviders>
      </body>
    </html>
  );
}
