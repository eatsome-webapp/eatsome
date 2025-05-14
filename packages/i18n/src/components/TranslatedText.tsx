'use client';

import { useDictionary } from '../client';

interface TranslatedTextProps {
  textKey: string;
  params?: Record<string, string>;
  className?: string;
}

/**
 * Client component for translated text
 * Usage: <TranslatedText textKey="common.welcome" />
 */
export function TranslatedText({ textKey, params, className }: TranslatedTextProps) {
  const { t } = useDictionary();
  
  return (
    <span className={className}>
      {t(textKey, params)}
    </span>
  );
} 