'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Locale, locales, defaultLocale } from './config';
import type { Dictionary } from './server';

// Hook to access dictionary from data attribute
export function useDictionary() {
  const getDictionaryValue = useCallback((key: string): string => {
    try {
      // Get dictionary from data attribute
      const dictionaryEl = document.querySelector('[data-dictionary]');
      if (!dictionaryEl) return key;

      const dictionary = JSON.parse(dictionaryEl.getAttribute('data-dictionary') || '{}');
      
      // Handle nested keys like 'auth.login.title'
      const parts = key.split('.');
      let value: any = dictionary;
      
      for (const part of parts) {
        if (!value || typeof value !== 'object') return key;
        value = value[part];
      }
      
      return typeof value === 'string' ? value : key;
    } catch (error) {
      console.error('Error accessing dictionary:', error);
      return key;
    }
  }, []);

  // t function for translations
  const t = useCallback((key: string, params?: Record<string, string>): string => {
    let text = getDictionaryValue(key);
    
    // Apply parameter replacements
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }
    
    return text;
  }, [getDictionaryValue]);

  return { t };
}

// Hook to manage language/locale
export function useLanguage() {
  const pathname = usePathname();
  
  // Extract the current locale from the pathname
  const getCurrentLocale = useCallback((): Locale => {
    const pathSegments = pathname.split('/');
    // The locale should be the first path segment that's not empty
    const firstSegment = pathSegments.find(segment => segment);
    
    if (firstSegment && locales.includes(firstSegment as Locale)) {
      return firstSegment as Locale;
    }
    return defaultLocale;
  }, [pathname]);
  
  const currentLocale = getCurrentLocale();
  
  // Set locale in cookie (can be used together with URL-based routing)
  const changeLocale = useCallback((locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);
  
  return {
    currentLocale,
    changeLocale
  };
} 