import { View, Text } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import globalStyles from '../../../styles/globalStyles';
import CustomButton from '../../../components/CustomButton';
import { generateRandomString } from '../../../utils/cache/asyncStorage';
import { useTranslation } from 'react-i18next';

const logo = require('../../../assets/lightning_logo_negativ.png');

const StartUpView = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const importHandler = async () => {
    generateRandomString(12);
    navigation.navigate('EULA', { isImport: true });
  };

  const createHandler = async () => {
    generateRandomString(12);
    navigation.navigate('Introduction');
  };

  return (
    <View
      style={[globalStyles.screenContainer, { justifyContent: 'space-around' }]}
    >
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={logo}
          style={{
            height: 100,
            width: 100,
            borderRadius: 10,
          }}
        />
        <Text style={globalStyles.textH1}>{t('StartUpView_Header')}</Text>
        <Text style={globalStyles.textBody}>
          {t('StartUpView_SelectionBody')}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <CustomButton
          text={t('StartUpView_StartFreshButton')}
          buttonConfig={{ onPress: createHandler }}
          containerStyles={{
            margin: 16,
            minWidth: '80%',
            justifyContent: 'center',
          }}
        />
        <CustomButton
          text={t('StartUpView_ImportButton')}
          buttonConfig={{ onPress: importHandler }}
          containerStyles={{
            margin: 16,
            minWidth: '80%',
            justifyContent: 'center',
          }}
        />
      </View>
    </View>
  );
};

export default StartUpView;
