import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

const resources = {
  en: {
    translation: en
  },
  pt: {
    translation: pt
  },
  es: {
    translation: es
  }
};

i18n
  .use(LanguageDetector) // Use the language detector plugin
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Fallback language if the detected language is not available
    keySeparator: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'navigator', 'localStorage'],
      lookupQuerystring: 'lang',
      caches: ['cookie','localStorage'] // Save the language in a cookie
    }
  });

export default i18n;
