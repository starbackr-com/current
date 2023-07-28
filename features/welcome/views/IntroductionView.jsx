import { View, Text } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../../../styles/globalStyles';
import { IntroductionItem } from '../components';
import CustomButton from '../../../components/CustomButton';
import { generateRandomString } from '../../../utils/cache/asyncStorage';

const IntroductionView = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const createHandler = () => {
    generateRandomString(12);
    navigation.navigate('EULA');
  };
  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView style={{ marginTop: 32, width: '100%' }} horizontal={false}>
        <View style={{ width: '100%', justifyContent: 'center' }}>
          <Text style={[globalStyles.textH2, { textAlign: 'center' }]}>
            The power of nostr + bitcoin at your hands!
          </Text>
        </View>
        <IntroductionItem
          title="Runs on nostr"
          text="Current is your gateway to the decentralised social network 'nostr'"
          icon="globe"
        />
        <IntroductionItem
          title="You are in control"
          text="Everything inside Current is controlled by cryptographic keys that only you have access to."
          icon="lock-closed"
        />
        <IntroductionItem
          title="Powered by Lightning"
          text="Zap away with an integrated Bitcoin Lightning Wallet"
          icon="flash"
        />
        <IntroductionItem
          title="Usernames"
          text="Current comes with a single username for your nostr and Lightning address"
          icon="person-circle-outline"
        />
      </ScrollView>
      <CustomButton
        text="Let's go!"
        buttonConfig={{ onPress: createHandler }}
      />
    </View>
  );
};

export default IntroductionView;
