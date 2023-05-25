import { View, Text, Pressable, Alert } from 'react-native';
import React, { useRef } from 'react';
import { colors, globalStyles } from '../../styles';
import useLanguage from '../../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native-gesture-handler';
import { storeData } from '../../utils/cache/asyncStorage';

type Language = {
  code: string;
  name: string;
};

const availableLanguages = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
];

const SettingsLanguageView = () => {
  const { t, i18n } = useTranslation('settings');

  const changeHandler = (language: Language) => {
    Alert.alert(
      'Change Language?',
      `Do you want to change the language to ${language.name}?`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            i18n.changeLanguage(language.code);
            await storeData('language', language.code);
          },
        },
        { text: 'No', style: 'destructive' },
      ],
    );
  };
  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.textBodyBold}>{t('test')}</Text>
      {i18n ? (
        <Text style={globalStyles.textBody}>{i18n.languages[0]}</Text>
      ) : undefined}
      <Text style={globalStyles.textBodyBold}>Select another language</Text>
      <View style={{ width: '100%' }}>
        <FlatList
          data={availableLanguages}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => ({
                flexDirection: 'column',
                width: '100%',
                backgroundColor: pressed
                  ? colors.backgroundActive
                  : colors.backgroundSecondary,
                padding: 6,
                borderRadius: 10,
                marginBottom: 12,
              })}
              onPress={() => {
                changeHandler(item);
              }}
            >
              <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
                {item.name}
              </Text>
              <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
                {t(item.name)}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

export default SettingsLanguageView;
