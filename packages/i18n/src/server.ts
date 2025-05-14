import 'server-only';
import type { Locale } from './config';
import { defaultLocale } from './config';

// Dictionary type
export type Dictionary = {
  [key: string]: string | Dictionary;
};

/**
 * Base dictionary loader function.
 * To be implemented by each app with their specific dictionaries.
 */
export type DictionaryLoader = (
  locale: Locale,
  namespace: string
) => Promise<Dictionary>;

/**
 * Get a dictionary for a specific locale and namespace
 * This is a generic function to be used by app-specific implementations
 */
export async function getDictionary(
  locale: Locale,
  namespace: string,
  dictionaryLoader: DictionaryLoader
): Promise<Dictionary> {
  try {
    return await dictionaryLoader(locale, namespace);
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}, namespace: ${namespace}`, error);
    // Fallback to default locale
    return await dictionaryLoader(defaultLocale, namespace);
  }
}

/**
 * Helper function to match the best locale from browser accept-language header
 */
export async function matchBestLocale(
  languages: readonly string[],
  availableLocales: readonly string[],
  defaultLoc: string
): Promise<string> {
  // Dynamic import formatjs only on server
  const { match } = await import('@formatjs/intl-localematcher');
  return match(languages, availableLocales, defaultLoc);
} 