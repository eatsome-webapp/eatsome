'use client';

import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n/config';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useDictionary, useLanguage } from '@/i18n/client';

export function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useDictionary();
  const { currentLocale, changeLocale } = useLanguage();
  
  // Get localized names and flags from the shared i18n package
  const languageNames = {
    en: 'English',
    nl: 'Nederlands',
    de: 'Deutsch',
  };
  
  const languageFlags = {
    en: '🇬🇧',
    nl: '🇳🇱',
    de: '🇩🇪',
  };
  
  // Create a path for the new locale by replacing the current locale in the path
  const getLocalizedPath = (locale: Locale): string => {
    // Get the current URL to create a relative URL
    const currentUrl = window.location.pathname;
    const segments = currentUrl.split('/');
    
    // Find where the current locale is in the path
    const localeIndex = segments.findIndex(segment => 
      segment && ['en', 'nl', 'de'].includes(segment)
    );
    
    if (localeIndex !== -1) {
      segments[localeIndex] = locale;
    } else {
      // If no locale segment found, add it as the first segment
      segments.splice(1, 0, locale);
    }
    
    return segments.join('/');
  };
  
  // Change the locale
  const handleLocaleChange = (locale: Locale) => {
    if (locale === currentLocale) return;
    
    // Set the locale cookie
    changeLocale(locale);
    
    // Update the URL path
    const newPath = getLocalizedPath(locale);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">{languageNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(languageNames).map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale as Locale)}
            className={`cursor-pointer ${currentLocale === locale ? 'bg-accent/50' : ''}`}
          >
            {languageFlags[locale as Locale]} {languageNames[locale as Locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 