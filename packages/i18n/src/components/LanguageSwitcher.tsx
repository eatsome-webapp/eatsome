'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale, languageNames, languageFlags } from '../config';
import { useDictionary } from '../client';

interface LanguageSwitcherProps {
  buttonClassName?: string;
  dropdownClassName?: string;
  Button: React.ComponentType<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }>;
  DropdownMenu: React.ComponentType<{
    children: React.ReactNode;
    trigger: React.ReactNode;
    align?: 'start' | 'center' | 'end';
  }>;
  DropdownMenuItem: React.ComponentType<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }>;
}

export function LanguageSwitcher({
  buttonClassName,
  dropdownClassName,
  Button,
  DropdownMenu,
  DropdownMenuItem
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useDictionary();
  
  // Extract the current locale from the pathname
  const getCurrentLocale = (): Locale => {
    const pathSegments = pathname.split('/');
    // The locale should be the first path segment that's not empty
    const firstSegment = pathSegments.find(segment => segment);
    
    if (firstSegment && locales.includes(firstSegment as Locale)) {
      return firstSegment as Locale;
    }
    return 'en'; // Default to English
  };
  
  const currentLocale = getCurrentLocale();
  
  // Create a path for the new locale by replacing the current locale in the path
  const getLocalizedPath = (locale: Locale): string => {
    const segments = pathname.split('/');
    const localeIndex = segments.findIndex(segment => 
      segment && locales.includes(segment as Locale)
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
    const newPath = getLocalizedPath(locale);
    router.push(newPath);
  };

  const trigger = (
    <Button 
      className={buttonClassName}
      onClick={() => {}}
    >
      {languageFlags[currentLocale]} {languageNames[currentLocale]}
    </Button>
  );

  return (
    <DropdownMenu
      trigger={trigger}
      align="end"
    >
      {locales.map((locale) => (
        <DropdownMenuItem
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className={dropdownClassName}
        >
          {languageFlags[locale]} {languageNames[locale]}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
} 