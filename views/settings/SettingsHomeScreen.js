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


import { useSelector } from "react-redux";


const settings = [
  'Payment Settings',
  'Backup Keys',
  'Network Settings',
  'Push Notifications',
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






const SettingsHomeScreen = ({ navigation }) => {


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
            marginBottom: 50,
          })
        }
      >


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


export default SettingsHomeScreen;
