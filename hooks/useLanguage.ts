import { useEffect, useState } from 'react';
import { getLocales } from 'expo-localization';
import { getValue } from '../utils';
import { getData } from '../utils/cache/asyncStorage';

const useLanguage = () => {
  const [language, setLanguage] = useState<string | null>();

  useEffect(() => {
    async function checkLanguage() {
      const savedLanguage = await getData('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      } else {
        setLanguage(getLocales()[0].languageCode);
      }
    }
    checkLanguage();
  }, []);

  return language;
};

export default useLanguage;
