'use client';

import { ReactNode } from 'react';
import { AnimationProvider } from '@/components/animations/AnimationProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AnimationProvider>
      {children}
    </AnimationProvider>
  );
} 