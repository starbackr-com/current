import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { globalStyles } from '../../styles';
import useLanguage from '../../hooks/useLanguage';
import { useTranslation } from 'react-i18next';

const SettingsLanguageView = () => {
  const selectedLanguage = useLanguage();
  const { t, i18n } = useTranslation('settings');
  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.textBodyBold}>{t('test')}</Text>
      {selectedLanguage ? (
        <Text style={globalStyles.textBody}>{selectedLanguage}</Text>
      ) : undefined}
      <Text style={globalStyles.textBodyBold}>Select another language</Text>
      <Text style={globalStyles.textBodyBold} onPress={() => {
        i18n.changeLanguage('de')
      }}>de</Text>
      <Text style={globalStyles.textBodyBold} onPress={() => {
        i18n.changeLanguage('en')
      }}>en</Text>
    </View>
  );
};

export default SettingsLanguageView;
