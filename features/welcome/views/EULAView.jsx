import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomButton } from '../../../components';
import globalStyles from '../../../styles/globalStyles';
import { useTranslation } from 'react-i18next';

const EULAView = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('welcome');

  const isImport = route?.params?.isImport;

  const acceptHandler = () => {
    if (isImport) {
      navigation.navigate('Import');
    } else {
      navigation.navigate('Username');
    }
  };
  const declineHandler = () => {
    navigation.goBack();
    // eslint-disable-next-line no-alert
    alert(
      'If you do not accept the EULA you will not be able to use Current... Sorry!',
    );
  };

  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.textH1}>{t('EULAView_H1')}</Text>
        <Text style={globalStyles.textH2}>{t('EULAView_H2_Intro')}</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_Intro')}
        </Text>
        <Text style={globalStyles.textH2}>{t('EULAView_H2_Prohibited')}</Text>
        <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
          {t('EULAView_H3_ProhibitedList_1')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_1_1')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_1_2')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_1_3')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_1_4')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_1_5')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_1_6')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_1_7')}
        </Text>
        <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
          {t('EULAView_H3_ProhibitedList_2')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_2_1')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_2_2')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_2_3')}
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_ProhibitedList_2_4')}
        </Text>
        <Text style={globalStyles.textH2}>{t('EULAView_H2_Consequences')}</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_Consequences')}
        </Text>
        <Text style={globalStyles.textH2}>{t('EULAView_H2_Disclaimer')}</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_Disclaimer')}
        </Text>
        <Text style={globalStyles.textH2}>{t('EULAView_H2_Changes')}</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_Changes')}
        </Text>
        <Text style={globalStyles.textH2}>{t('EULAView_H2_Contact')}</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_Contact')}
        </Text>
        <Text style={globalStyles.textH2}>{t('EULAView_H2_Acceptance')}</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {t('EULAView_Body_Acceptance')}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'space-evenly',
            marginVertical: 16,
          }}
        >
          <CustomButton
            text="Accept"
            containerStyles={{ marginBottom: 16 }}
            buttonConfig={{ onPress: acceptHandler }}
          />
          <CustomButton
            text="Decline"
            buttonConfig={{ onPress: declineHandler }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EULAView;
