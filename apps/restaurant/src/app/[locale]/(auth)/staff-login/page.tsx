'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Locale } from '@/i18n/config';
import { useDictionary } from '@/i18n/client';
import { signInWithPIN } from '@repo/auth';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';

interface StaffCredentials {
  pin: string;
}

export default function StaffLoginPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom') || `/${locale}/(staff)/orders`;
  const { t } = useDictionary();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin || pin.length < 4) {
      setError(t('auth.errors.invalidPin'));
      return;
    }
    
    setLoading(true);
    
    try {
      // This is an example, implement the actual PIN authentication
      await signInWithPIN(pin);
      
      // Navigate to the staff area
      router.push(redirectedFrom);
      router.refresh();
    } catch (err) {
      console.error('Error signing in:', err);
      setError(t('auth.errors.invalidPin'));
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{t('auth.staffLogin.title')}</h2>
        <p className="text-gray-600 mt-1">{t('auth.staffLogin.subtitle')}</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="text-center">
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center text-2xl tracking-widest py-6"
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6"
          disabled={loading}
          size="lg"
        >
          {loading ? 'Loading...' : t('auth.staffLogin.signIn')}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <Button 
          variant="link" 
          onClick={() => router.push(`/${locale}/(auth)/login`)}
        >
          {t('auth.staffLogin.adminLogin')}
        </Button>
      </div>
    </>
  );
} 