
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all English locale files
import enCommon from './locales/en/common.json';
import enLanguage from './locales/en/language.json';
import enLanding from './locales/en/landing.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enStudents from './locales/en/students.json';
import enTests from './locales/en/tests.json';
import enSettings from './locales/en/settings.json';
import enSubscription from './locales/en/subscription.json';
import enScheduling from './locales/en/scheduling.json';
import enLessonTopics from './locales/en/lessonTopics.json';

// Import all Spanish locale files
import esCommon from './locales/es/common.json';
import esLanguage from './locales/es/language.json';
import esLanding from './locales/es/landing.json';
import esAuth from './locales/es/auth.json';
import esDashboard from './locales/es/dashboard.json';
import esStudents from './locales/es/students.json';
import esTests from './locales/es/tests.json';
import esSettings from './locales/es/settings.json';
import esSubscription from './locales/es/subscription.json';
import esScheduling from './locales/es/scheduling.json';
import esLessonTopics from './locales/es/lessonTopics.json';

// Merge all English translations into a single object
const enTranslation = {
  ...enCommon,
  language: enLanguage,
  landing: enLanding,
  auth: enAuth,
  dashboard: enDashboard,
  students: enStudents,
  tests: enTests,
  settings: enSettings,
  subscription: enSubscription,
  scheduling: enScheduling,
  lessonTopics: enLessonTopics,
};

// Merge all Spanish translations into a single object
const esTranslation = {
  ...esCommon,
  language: esLanguage,
  landing: esLanding,
  auth: esAuth,
  dashboard: esDashboard,
  students: esStudents,
  tests: esTests,
  settings: esSettings,
  subscription: esSubscription,
  scheduling: esScheduling,
  lessonTopics: esLessonTopics,
};

// Configure resources for i18next
const resources = {
  es: {
    translation: esTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  // Detect the browser language
  .use(LanguageDetector)
  // Pass i18n to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'es', // Default to Spanish
    debug: false, // Disable debug to avoid issues
    
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
  });

// Make sure the language is loaded correctly from localStorage
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
  i18n.changeLanguage(savedLanguage);
}

export default i18n;
