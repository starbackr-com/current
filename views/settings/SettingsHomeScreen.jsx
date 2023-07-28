import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, Pressable } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Linking from 'expo-linking';
import { deleteValue } from '../../utils/secureStore';
import { logOut } from '../../features/authSlice';
import { resetAll } from '../../features/introSlice';
import { clearStore } from '../../features/messagesSlice';
import { clearUserStore } from '../../features/userSlice';
import CustomButton from '../../components/CustomButton';
import appJson from '../../app.json';
import {
  generateRandomString,
  removeData,
} from '../../utils/cache/asyncStorage';
import { colors, globalStyles } from '../../styles';
import { dbLogout } from '../../utils/database';

const settings = [
  'Premium',
  'Payment Settings',
  'Backup Keys',
  'Network Settings',
  'Push Notifications',
  'Muted Users',
  'Language Settings',
  'Delete Account',
];

const SettingItem = ({ item, onNav }) => (
  <Pressable
    style={({ pressed }) => [
      {
        width: '100%',
        backgroundColor: '#222222',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 10,
        marginBottom: 16,
      },
      pressed ? { backgroundColor: '#333333' } : undefined,
    ]}
    onPress={() => {
      onNav(item);
    }}
  >
    <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>{item}</Text>
  </Pressable>
);

const SettingsHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const navigationHandler = (route) => {
    navigation.navigate(route);
  };

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
    dispatch(logOut());
    dispatch(resetAll());
  };

  const introHandler = async () => {
    await AsyncStorage.removeItem('appId');
    generateRandomString(12);
    await removeData(['twitterModalShown', 'getStartedItemsShown']);
    dispatch(resetAll());
  };

  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ width: '100%', flex: 1 }}>
        <FlatList
          style={{ width: '100%', flexGrow: 0 }}
          data={settings}
          renderItem={({ item }) => (
            <SettingItem item={item} onNav={navigationHandler} />
          )}
        />
      </View>

      <View
        style={
          (globalStyles.screenContainer,
          {
            width: '100%',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            marginBottom: 50,
          })
        }
      >
        <CustomButton
          text="Sign Out"
          buttonConfig={{ onPress: logoutHandler }}
        />
      </View>

      <Text
        style={[
          globalStyles.textBody,
          { color: colors.primary500, marginBottom: 16 },
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
    </View>
  );
};

export default SettingsHomeScreen;
