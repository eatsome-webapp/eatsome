'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { gsap } from 'gsap';

interface AnimationContextType {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const AnimationContext = createContext<AnimationContextType>({
  reducedMotion: false,
  toggleReducedMotion: () => {},
});

// Default animation settings
const defaultTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 40,
  mass: 1
};

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check user's system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    // Set GSAP defaults
    gsap.defaults({
      duration: reducedMotion ? 0.1 : 0.5,
      ease: 'power2.out',
    });
    
    // Listen for changes in preferences
    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);
  
  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };
  
  return (
    <AnimationContext.Provider value={{ reducedMotion, toggleReducedMotion }}>
      <MotionConfig 
        reducedMotion={reducedMotion ? 'always' : 'never'} 
        transition={defaultTransition}
      >
        {children}
      </MotionConfig>
    </AnimationContext.Provider>
  );
}

export const useAnimation = () => useContext(AnimationContext); 