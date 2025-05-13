'use client';

import React, { useEffect, useState } from 'react';

/**
 * Custom hook to check if the user prefers reduced motion
 * @returns Boolean indicating if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check for window to avoid SSR issues
    if (typeof window !== 'undefined') {
      // Check if the browser supports this API
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Set the initial value
      setPrefersReducedMotion(query.matches);
      
      // Define a callback for when the preference changes
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };
      
      // Add the callback to the media query
      query.addEventListener('change', handleChange);
      
      // Clean up
      return () => {
        query.removeEventListener('change', handleChange);
      };
    }
    
    // Default to false for SSR
    return () => {};
  }, []);
  
  return prefersReducedMotion;
} 