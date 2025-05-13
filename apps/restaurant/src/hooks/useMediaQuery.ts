'use client';

import React, { useEffect, useState } from 'react';

/**
 * Custom hook to check if current viewport matches a media query
 * @param query Media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Check for window to avoid SSR issues
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Set the initial value
      setMatches(media.matches);
      
      // Define a callback for when the media query changes
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      
      // Add the callback to the media query
      // Using addEventListener for modern browsers
      media.addEventListener('change', listener);
      
      // Clean up
      return () => {
        media.removeEventListener('change', listener);
      };
    }
    
    // Default to false for SSR
    return () => {};
  }, [query]);
  
  return matches;
} 