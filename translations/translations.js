/* eslint-disable quote-props */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { getData } from '../utils/cache/asyncStorage';
import welcomeTranslations from '../features/welcome/locale';
import settingsTranslations from '../features/settings/locale'

async function checkLanguage() {
  const selectedLanguage = await getData('language');
  if (selectedLanguage) {
    i18n.changeLanguage(selectedLanguage);
  }
  i18n.changeLanguage(getLocales()[0].languageCode);
}

const resources = {
  en: {
    welcome: welcomeTranslations.en,
    settings: settingsTranslations.en,
  },
  de: {
    welcome: welcomeTranslations.de,
    settings: settingsTranslations.de,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

checkLanguage();

export default i18n;
