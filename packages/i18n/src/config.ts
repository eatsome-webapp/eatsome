/**
 * Shared i18n configuration for the EatSome platform
 */

export type Locale = 'en' | 'nl' | 'de';

// Supported locales
export const locales: Locale[] = ['en', 'nl', 'de'];

// Default locale
export const defaultLocale: Locale = 'en';

// Language names for display
export const languageNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
};

// Language flags for UI
export const languageFlags: Record<Locale, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
  de: '🇩🇪',
};

// Get default locale for fallback
export function getDefaultLocale(): Locale {
  return defaultLocale;
}

// Check if a locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
} 