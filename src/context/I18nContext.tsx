import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../data/i18n.json';

type Locale = 'id' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('dimsum_locale');
    if (saved === 'id' || saved === 'en') return saved;
    // auto detect browser language as requested in PRD 4.1
    if (typeof navigator !== 'undefined' && navigator.language.startsWith('en')) {
      return 'en';
    }
    return 'id';
  });

  useEffect(() => {
    localStorage.setItem('dimsum_locale', locale);
  }, [locale]);

  const t = (key: string): string => {
    const dict = (translations as Record<string, Record<string, string>>)[locale] || translations.id;
    return dict[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

