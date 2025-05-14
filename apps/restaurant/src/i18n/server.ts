import 'server-only';
import type { Locale } from '@repo/i18n';
import { defaultLocale, Dictionary, DictionaryLoader } from '@repo/i18n';

// App-specific dictionary namespaces
export type DictionaryNamespace = 'common' | 'auth' | 'admin' | 'staff';

// Dictionary cache for this app
const dictionaries: Record<string, Record<string, () => Promise<Dictionary>>> = {
  en: {
    common: () => import('./dictionaries/en/common.json').then((module) => module.default),
    auth: () => import('./dictionaries/en/auth.json').then((module) => module.default),
    admin: () => import('./dictionaries/en/admin.json').then((module) => module.default),
    staff: () => import('./dictionaries/en/staff.json').then((module) => module.default),
  },
  nl: {
    common: () => import('./dictionaries/nl/common.json').then((module) => module.default),
    auth: () => import('./dictionaries/nl/auth.json').then((module) => module.default),
    admin: () => import('./dictionaries/nl/admin.json').then((module) => module.default),
    staff: () => import('./dictionaries/nl/staff.json').then((module) => module.default),
  },
  de: {
    common: () => import('./dictionaries/de/common.json').then((module) => module.default),
    auth: () => import('./dictionaries/de/auth.json').then((module) => module.default),
    admin: () => import('./dictionaries/de/admin.json').then((module) => module.default),
    staff: () => import('./dictionaries/de/staff.json').then((module) => module.default),
  },
};

// Restaurant-specific dictionary loader
const restaurantDictionaryLoader: DictionaryLoader = async (
  locale: Locale,
  namespace: string
): Promise<Dictionary> => {
  try {
    // Check if the dictionary namespace exists for this locale
    if (dictionaries[locale] && dictionaries[locale][namespace]) {
      return await dictionaries[locale][namespace]();
    }
    throw new Error(`Dictionary not found for locale: ${locale}, namespace: ${namespace}`);
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}, namespace: ${namespace}`, error);
    // Fallback to default locale
    return await dictionaries[defaultLocale][namespace]();
  }
};

// Get a dictionary for a specific locale and namespace
export async function getDictionary(
  locale: Locale,
  namespace: DictionaryNamespace
): Promise<Dictionary> {
  return restaurantDictionaryLoader(locale, namespace);
} 