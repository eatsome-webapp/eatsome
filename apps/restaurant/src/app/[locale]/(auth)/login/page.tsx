'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/server';
import { signInWithEmail } from '@repo/auth';
import { useDictionary } from '@/i18n/client';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Checkbox } from '@repo/ui/components/ui/checkbox';

export default function LoginPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { t } = useDictionary();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('auth.errors.invalidCredentials'));
      return;
    }
    
    setLoading(true);
    
    try {
      await signInWithEmail(email, password);
      
      // Navigate to the admin dashboard
      router.push(`/${locale}/(admin)/dashboard`);
      router.refresh();
    } catch (err) {
      console.error('Error signing in:', err);
      setError(t('auth.errors.invalidCredentials'));
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{t('auth.login.title')}</h2>
        <p className="text-gray-600 mt-1">{t('auth.login.subtitle')}</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.login.email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">{t('auth.login.password')}</Label>
            <a 
              href="#" 
              className="text-sm text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                // Add forgot password functionality
              }}
            >
              {t('auth.login.forgotPassword')}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked as boolean)}
          />
          <Label 
            htmlFor="remember" 
            className="text-sm font-normal cursor-pointer"
          >
            {t('auth.login.remember')}
          </Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : t('auth.login.signIn')}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          {t('auth.login.noAccount')} <a href="#" className="text-primary hover:underline">{t('auth.login.contact')}</a>
        </p>
      </div>
    </>
  );
} 