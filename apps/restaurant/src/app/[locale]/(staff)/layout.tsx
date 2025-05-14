'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@repo/auth';
import { Locale } from '@/i18n/config';
import { useDictionary } from '@/i18n/client';
import { Button } from '@repo/ui/components/ui/button';

export default function StaffLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const pathname = usePathname();
  const { t } = useDictionary();
  
  const handleSignOut = async () => {
    await signOut();
    window.location.href = `/${locale}/(auth)/staff-login`;
  };
  
  // Helper to check if a link is active
  const isLinkActive = (path: string) => {
    return pathname.startsWith(`/${locale}/(staff)/${path}`);
  };

  return (
    <div className="staff-mode">
      <div className="flex h-screen">
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <h1 className="font-bold text-xl">EatSome Staff</h1>
          </div>
          
          <nav className="py-4 flex-1">
            <ul className="space-y-1">
              <li>
                <Link 
                  href={`/${locale}/(staff)/orders`}
                  className={`flex items-center px-4 py-3 text-sm rounded-md ${
                    isLinkActive('orders') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-lg">📋</span>
                  {t('staff.navigation.orders')}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/(staff)/kitchen`}
                  className={`flex items-center px-4 py-3 text-sm rounded-md ${
                    isLinkActive('kitchen') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-lg">👨‍🍳</span>
                  {t('staff.navigation.kitchen')}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/(staff)/tables`}
                  className={`flex items-center px-4 py-3 text-sm rounded-md ${
                    isLinkActive('tables') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-lg">🪑</span>
                  {t('staff.navigation.tables')}
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <Button 
              onClick={handleSignOut}
              variant="secondary"
              className="w-full justify-start"
            >
              <span className="mr-2">🚪</span>
              {t('staff.navigation.signOut')}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center px-6 bg-white">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {pathname.includes('/orders') && t('staff.titles.orders')}
                {pathname.includes('/kitchen') && t('staff.titles.kitchen')}
                {pathname.includes('/tables') && t('staff.titles.tables')}
              </h2>
            </div>
            
            <div className="flex space-x-2">
              {/* Status indicators and quick actions */}
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium">{t('staff.status.online')}</span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 