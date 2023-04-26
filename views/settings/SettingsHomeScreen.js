import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, Pressable } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteValue } from '../../utils/secureStore';
import { logOut } from '../../features/authSlice';
import { resetAll } from '../../features/introSlice';
import { clearStore } from '../../features/messagesSlice';
import { clearUserStore } from '../../features/userSlice';
import { dbLogout } from '../../utils/database';
import * as Linking from 'expo-linking';
import CustomButton from '../../components/CustomButton';
import { removeData } from '../../utils/cache/asyncStorage';
import appJson from '../../app.json';
import { generateRandomString } from '../../utils/cache/asyncStorage';
import { colors, globalStyles } from '../../styles';
import Checkbox from 'expo-checkbox';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useSelector } from "react-redux";


const settings = [
  'Payment Settings',
  'Backup Keys',
  'Network Settings',
  'Notifications',
  'Muted Users',
  'Delete Account',
];



const SettingItem = ({ item, onNav }) => {

  return (
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
};

const pushHandler = async () => {

  const [expoPushToken, setExpoPushToken] = useState('');

  try {

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  } catch (e) {

    console.log('push error: ', e);

  } finally {

  }

};




const SettingsHomeScreen = ({ navigation }) => {


  const { pubKey, walletBearer } = useSelector((state) => state.auth);
  const [ispushnotifyChecked, setpushnotifyChecked] = useState(false);
  const dispatch = useDispatch();
  const navigationHandler = (route) => {
    navigation.navigate(route);
  };
  const logoutHandler = async () => {
    await deleteValue('privKey');
    await deleteValue('username');
    await deleteValue('mem');
    await dbLogout();
    await removeData(['twitterModalShown', 'zapAmount', 'zapComment', 'relays']);
    dispatch(clearStore());
    dispatch(clearUserStore());
    dispatch(logOut());
    dispatch(resetAll());
  };



  const pushtoken = async () => {

    const settings = await Notifications.getPermissionsAsync();

    console.log(settings);

    if (settings.granted) {
          alert('Push notification is enabled..!');
          //return;

    }

    const token = await registerForPushNotificationsAsync();

    if (token) {

      const response = await fetch(`${process.env.BASEURL}/v2/pushtoken`, {
          method: "POST",
          body: JSON.stringify({token : token}),
          headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${walletBearer}`,
          },
      });

      const data = await response.json();
      console.log(data);
      if (data.data != 'updated') alert('Push token update failed. Please contact support');

    }




  }

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

        <CustomButton
          text="Sign Out"
          buttonConfig={{ onPress: logoutHandler }}
        />
      </View>

      <View
        style={
          (globalStyles.screenContainer,
          {
            width: '100%',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            marginBottom: 200,
          })
        }
      >

      <Text
        style={
          (globalStyles.textH2, { color: colors.primary500, marginTop: 32 })
        }
        onPress={pushtoken}
      >
        Enable Push notification?
      </Text>
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
        v{appJson.expo.version} ({appJson.expo.ios.buildNumber})
      </Text>
    </View>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  console.log(Device);
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
    });
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);



  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default SettingsHomeScreen;
