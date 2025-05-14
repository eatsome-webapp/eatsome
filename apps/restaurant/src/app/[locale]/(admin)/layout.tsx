'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@repo/auth';
import { Locale } from '@/i18n/config';
import { useDictionary } from '@/i18n/client';
import { Button } from '@repo/ui/components/ui/button';

export default function AdminLayout({
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
    window.location.href = `/${locale}/(auth)/login`;
  };
  
  // Helper to check if a link is active
  const isLinkActive = (path: string) => {
    return pathname.startsWith(`/${locale}/(admin)/${path}`);
  };

  return (
    <div className="admin-mode">
      <div className="flex h-screen">
        <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <div className="p-4 border-b">
            <h1 className="font-bold text-xl">EatSome Admin</h1>
          </div>
          
          <nav className="py-4">
            <ul className="space-y-1">
              <li>
                <Link 
                  href={`/${locale}/(admin)/dashboard`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isLinkActive('dashboard') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">📊</span>
                  {t('admin.navigation.dashboard')}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/(admin)/menu`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isLinkActive('menu') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">🍽️</span>
                  {t('admin.navigation.menu')}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/(admin)/orders`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isLinkActive('orders') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">📋</span>
                  {t('admin.navigation.orders')}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/(admin)/settings`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isLinkActive('settings') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">⚙️</span>
                  {t('admin.navigation.settings')}
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start"
            >
              <span className="mr-2">🚪</span>
              {t('admin.navigation.signOut')}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center px-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {pathname.includes('/dashboard') && t('admin.titles.dashboard')}
                {pathname.includes('/menu') && t('admin.titles.menu')}
                {pathname.includes('/orders') && t('admin.titles.orders')}
                {pathname.includes('/settings') && t('admin.titles.settings')}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Add additional header items like notifications, profile, etc. */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = `/${locale}/(staff)/orders`}
              >
                {t('admin.actions.switchToStaff')}
              </Button>
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