'use client';

import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { useDictionary } from '@/i18n/client';

export default function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { t } = useDictionary();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-primary">EatSome</h1>
          </Link>
        </div>
        
        {children}
      </div>
    </div>
  );
} 