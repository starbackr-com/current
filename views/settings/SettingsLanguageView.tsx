import { View, Text, Pressable, Alert } from 'react-native';
import React, { useCallback, useRef } from 'react';
import { colors, globalStyles } from '../../styles';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native-gesture-handler';
import { storeData } from '../../utils/cache/asyncStorage';
import MenuBottomSheetWithData from '../../components/MenuBottomSheetWithData';
import { CustomButton } from '../../components';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const availableLanguages = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
];

const SettingsLanguageView = () => {
  const { t, i18n } = useTranslation('settings');

  const modalRef = useRef<BottomSheetModalMethods>();

  return (
    <View style={globalStyles.screenContainer}>
      <View
        style={{
          marginBottom: 32,
          backgroundColor: colors.backgroundSecondary,
          padding: 10,
          borderRadius: 10,
          width: '100%',
        }}
      >
        <Text style={globalStyles.textBodyBold}>
          {t('SettingsLanguageView_H2_Active')}
        </Text>
        {i18n ? (
          <Text style={globalStyles.textBody}>{i18n.languages[0]}</Text>
        ) : undefined}
      </View>
      <Text style={globalStyles.textBodyBold}>
        {t('SettingsLanguageView_H2_Select')}
      </Text>
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
                if (modalRef.current) {
                  modalRef.current.present(item);
                }
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
      <MenuBottomSheetWithData
        render={useCallback(
          (data) => (
            <>
              <Text style={globalStyles.textBody}>
                Do you want to change the selected language to{' '}
                <Text style={globalStyles.textBodyBold}>{data.name}</Text>?
              </Text>
              <CustomButton
                text="Change Language"
                buttonConfig={{
                  onPress: async () => {
                    i18n.changeLanguage(data.code);
                    await storeData('language', data.code);
                    modalRef.current.dismiss();
                  },
                }}
                containerStyles={{ marginTop: 12 }}
              />
              <CustomButton
                text="Cancel"
                buttonConfig={{
                  onPress: () => {
                    modalRef.current.dismiss();
                  },
                }}
                containerStyles={{ marginTop: 12 }}
              />
            </>
          ),
          [],
        )}
        ref={modalRef}
      />
    </View>
  );
};

export default SettingsLanguageView;
