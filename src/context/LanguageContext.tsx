import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Currency } from '../types';
import { translations, TranslationKey } from '../locales/translations';
import { usdToUzs, USD_TO_UZS_RATE } from '../utils/currency';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  formatPrice: (usdAmount: number, currency: Currency) => string;
}

const STORAGE_KEY = 'mixmobile_language_preference';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'uz' || saved === 'ru' || saved === 'en') {
        return saved as Language;
      }
    } catch {
      // fallback
    }
    return 'uz'; // Default language for Uzbekistan market
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const formatPrice = (usdAmount: number, currency: Currency): string => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(usdAmount);
    }

    // UZS Currency
    const uzsVal = usdToUzs(usdAmount, USD_TO_UZS_RATE);
    
    if (language === 'en') {
      const formattedNum = new Intl.NumberFormat('en-US').format(uzsVal);
      return `${formattedNum} UZS`;
    }
    
    if (language === 'ru') {
      const formattedNum = new Intl.NumberFormat('ru-RU').format(uzsVal);
      return `${formattedNum} сум`;
    }

    // Default Uzbek
    const formattedNum = new Intl.NumberFormat('ru-RU').format(uzsVal);
    return `${formattedNum} so'm`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
