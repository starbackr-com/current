import { View, Text, ScrollView, Alert } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../../styles';
import { ImportTypeItem } from '../components';
import { CustomButton } from '../../../components';

const ImportSelectionView = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(['welcome', 'common']);
  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={globalStyles.textH2}>{t('ImportSelectionView_H2')}</Text>
      <ScrollView
        style={{ width: '100%', flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <ImportTypeItem
          title={t('ImportSelectionView_H3_Item_1')}
          text={t('ImportSelectionView_Body_Item_1')}
          example="nsec1wae9gwn52p2qa4f50xhe2hrefqn8kat4..."
          icon="key"
          onPress={() => {
            navigation.navigate('ImportKey');
          }}
        />
        <ImportTypeItem
          title={t('ImportSelectionView_H3_Item_2')}
          text={t('ImportSelectionView_Body_Item_2')}
          example="target traffic extend boss maximum zero illegal much people bitter crack fire"
          icon="newspaper"
          onPress={() => {
            navigation.navigate('ImportWords');
          }}
        />
        <ImportTypeItem
          title={t('ImportSelectionView_H3_Item_3')}
          text={t('ImportSelectionView_Body_Item_3')}
          icon="help"
          onPress={() => {
            Alert.alert(
              t('ImportSelectionView_H2_Item_3_Action'),
              t('ImportSelectionView_Body_Item_3_Action'),
              [
                {
                  text: t('Common_Yes'),
                  onPress: () => {
                    navigation.navigate('Username');
                  },
                },
                {
                  text: t('Common_No'),
                },
              ],
            );
          }}
        />
      </ScrollView>
      <CustomButton
        text="Back"
        buttonConfig={{
          onPress: () => {
            navigation.goBack();
          },
        }}
      />
    </View>
  );
};

export default ImportSelectionView;
