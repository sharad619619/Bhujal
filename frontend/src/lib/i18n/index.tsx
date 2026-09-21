'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import en, { TranslationKeys } from './en';
import hi from './hi';
import type { Language } from '@/lib/types';

const translations: Record<Language, TranslationKeys> = { en, hi: hi as unknown as TranslationKeys };

// Helper to get nested value by dot-separated key
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? path;
}

// Create a callable proxy that also allows property access
function createTranslationProxy(translationObj: TranslationKeys): TranslationKeys & ((key: string) => string) {
  const fn = (key: string) => getNestedValue(translationObj, key);
  
  // Copy all properties from translation object to the function
  return new Proxy(fn, {
    get(target, prop, receiver) {
      if (prop in translationObj) {
        return (translationObj as any)[prop];
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as any;
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys & ((key: string) => string);
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: createTranslationProxy(en),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    }
  }, []);

  const t = createTranslationProxy(translations[language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

export { I18nContext };
