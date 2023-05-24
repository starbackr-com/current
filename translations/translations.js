/* eslint-disable quote-props */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { getData } from '../utils/cache/asyncStorage';

async function checkLanguage() {
  const selectedLanguage = await getData('language');
  if (selectedLanguage) {
    i18n.changeLanguage(selectedLanguage);
  }
  i18n.changeLanguage(getLocales()[0].languageCode);
}

const resources = {
  en: {
    translation: {
      'StartUpView_Header': 'Welcome, stranger!',
      'StartUpView_SelectionBody': 'Do you want to create a new key-pair or import an existing one?',
      'StartUpView_StartFreshButton': 'Start Fresh',
      'StartUpView_ImportButton': 'Import keys',
    },
  },
  de: {
    translation: {
      'StartUpView_Header': 'Willkommen!',
      'StartUpView_SelectionBody': 'Willst du ein neues Schlüsselpaar erstellen oder ein bestehendes importieren?',
      'StartUpView_StartFreshButton': 'Schlüsselpaar erstellen',
      'StartUpView_ImportButton': 'Schlüssel importieren',
    },
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
