import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
// In a real app with many files, we might want to use i18next-http-backend
// but for now we'll bundle them to ensure they work immediately without server config
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import es from './locales/es/translation.json';
import ja from './locales/ja/translation.json';
import de from './locales/de/translation.json';
import pt from './locales/pt/translation.json';
import it from './locales/it/translation.json';

i18n
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
        debug: true,
        fallbackLng: 'en', // Default language is English
        resources: {
            en: {
                translation: en
            },
            fr: {
                translation: fr
            },
            es: {
                translation: es
            },
            ja: {
                translation: ja
            },
            de: {
                translation: de
            },
            pt: {
                translation: pt
            },
            it: {
                translation: it
            }
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;
