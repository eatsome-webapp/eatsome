'use client';

import React, { useEffect, useState } from 'react';
import { SplitCard } from '@/components/home/SplitCard';
import { LeadConversionCard } from '@/components/home/LeadConversionCard';
import { LoginCard } from '@/components/home/LoginCard';
import { Footer } from '@/components/home/Footer';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { useSearchParams } from 'next/navigation';

export default function RestaurantHomepage() {
  const searchParams = useSearchParams();
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  
  useEffect(() => {
    const authError = searchParams.get('auth_error');
    const generalError = searchParams.get('error');
    
    if (authError === 'session_expired') {
      setErrorBanner('Je sessie is verlopen. Log opnieuw in om verder te gaan.');
    } else if (generalError === 'unexpected') {
      setErrorBanner('Er is een onverwachte fout opgetreden. Probeer het opnieuw.');
    }
  }, [searchParams]);
  
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      {errorBanner && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 fixed top-0 left-0 right-0 z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">{errorBanner}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button 
                  onClick={() => setErrorBanner(null)}
                  className="inline-flex rounded-md p-1.5 text-amber-500 hover:bg-amber-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Mobile-only logo and tagline */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <AnimatedLogo size="large" />
            <h1 className="text-2xl font-bold mt-4 text-center">
              Restaurant Management,{" "}
              <span className="text-primary-600">Simplified</span>
            </h1>
          </div>
          
          <SplitCard>
            <LeadConversionCard />
            <LoginCard />
          </SplitCard>
        </div>
      </div>
      <Footer />
    </main>
  );
}
