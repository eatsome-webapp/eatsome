import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/server';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(locale as Locale, 'common');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 font-primary">{dict.welcome}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-secondary">
              {dict.navigation.menu}
            </h2>
            <p className="text-muted-foreground">
              Manage your restaurant menu, update prices, and add specials.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-secondary">
              {dict.navigation.orders}
            </h2>
            <p className="text-muted-foreground">
              Track and manage incoming orders from customers.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-secondary">
              {dict.navigation.profile}
            </h2>
            <p className="text-muted-foreground">
              Update your restaurant profile and contact information.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-secondary">
              {dict.navigation.settings}
            </h2>
            <p className="text-muted-foreground">
              Configure your account settings and preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 