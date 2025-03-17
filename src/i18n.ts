
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslation from './locales/es.json';
import enTranslation from './locales/en.json';

// Configuración de recursos de idioma
const resources = {
  es: {
    translation: esTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  // Detecta el idioma del navegador
  .use(LanguageDetector)
  // Pasa el i18n a react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto en español
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // No es necesario para React
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
  });

export default i18n;
