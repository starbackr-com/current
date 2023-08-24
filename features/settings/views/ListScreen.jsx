import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import React from 'react';
import Purchases from 'react-native-purchases';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { colors, globalStyles } from '../../../styles';
import { deleteValue } from '../../../utils';
import { dbLogout } from '../../../utils/database';
import {
  generateRandomString,
  removeData,
} from '../../../utils/cache/asyncStorage';
import { clearStore } from '../../messagesSlice';
import { clearUserStore } from '../../userSlice';
import { resetAll } from '../../introSlice';
import { logOut } from '../../authSlice';
import appJson from '../../../app.json';
import { SettingItem } from '../components';

const ListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { walletBearer } = useSelector((state) => state.auth);
  const { pushToken } = useSelector((state) => state.user);

  const logoutHandler = async () => {
    // clear push notifications
    const initialState = {
      status: false,
      zaps: false,
      dm: false,
      mention: false,
      reposts: false,
      likes: false,
      lntxn: false,
      token: pushToken,
    };

    await fetch(`${process.env.BASEURL}/v2/pushtoken`, {
      method: 'POST',
      body: JSON.stringify(initialState),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${walletBearer}`,
      },
    });

    await deleteValue('privKey');
    await deleteValue('username');
    await deleteValue('mem');
    await dbLogout();
    await removeData([
      'twitterModalShown',
      'zapAmount',
      'zapComment',
      'relays',
      'pushToken',
    ]);
    dispatch(clearStore());
    dispatch(clearUserStore());
    dispatch(resetAll());
    dispatch(logOut());
  };

  const introHandler = async () => {
    await AsyncStorage.removeItem('appId');
    generateRandomString(12);
    await removeData(['twitterModalShown', 'getStartedItemsShown']);
    dispatch(resetAll());
  };

  return (
    <ScrollView
      style={[globalStyles.screenContainerScroll, { paddingTop: 12 }]}
    >
      <View
        style={{
          width: '100%',
          flex: 1,
          gap: 2,
        }}
      >
        <SettingItem
          title="Premium"
          icon="heart"
          description="Everything regarding Current's premium subscription 'Amped'"
          onPress={() => {
            navigation.navigate('Premium');
          }}
        />
        <SettingItem
          title="Payments"
          icon="flash"
          description="Zap and wallet settings"
          onPress={() => {
            navigation.navigate('Payment Settings');
          }}
        />
        <SettingItem
          title="Keys"
          icon="key"
          description="Access your keys and create a backup"
          onPress={() => {
            navigation.navigate('Backup Keys');
          }}
        />
        <SettingItem
          title="Network"
          icon="globe"
          description="Edit your relay config or connect to new relays"
          onPress={() => {
            navigation.navigate('Network Settings');
          }}
        />
        <SettingItem
          title="Notifications"
          icon="notifications"
          description="Control when Current is going top notify you about new events"
          onPress={() => {
            navigation.navigate('Push Notifications');
          }}
        />
        <SettingItem
          title="Muted Users"
          icon="md-volume-mute"
          description="See and edit the list of users that you muted"
          onPress={() => {
            navigation.navigate('Muted Users');
          }}
        />
        <SettingItem
          title="Language"
          icon="flag"
          description="Control the language Current is in"
          onPress={() => {
            navigation.navigate('Language Settings');
          }}
        />
        <SettingItem
          title="Delete Account"
          icon="warning"
          description="Delete your account and data associated with it"
          onPress={() => {
            navigation.navigate('Delete Account');
          }}
        />
        <SettingItem
          title="Sign Out"
          icon="power"
          description="Log out and clear local data."
          onPress={logoutHandler}
        />
      </View>

      <Text
        style={[
          globalStyles.textBody,
          { color: colors.primary500, marginVertical: 16 },
        ]}
        onPress={() => {
          Linking.openURL('https://app.getcurrent.io/terms-and-privacy');
        }}
      >
        Terms and Privacy
      </Text>
      <Text onPress={introHandler} style={globalStyles.textBodyS}>
        {`v${appJson.expo.version} ${appJson.expo.ios.buildNumber}`}
      </Text>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

export default ListScreen;
