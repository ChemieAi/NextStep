import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// JSON dosyalarını import et
import translationEN from "./locales/en/translation.json";
import translationTR from "./locales/tr/translation.json";

// Çeviriler
const resources = {
  en: {
    translation: translationEN,
  },
  tr: {
    translation: translationTR,
  },
};

i18n
  .use(LanguageDetector) // otomatik dil algılama
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false, // React zaten XSS'e karşı güvenli
    },
  });

export default i18n;
