import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, Pressable } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteValue } from '../../utils/secureStore';
import { logOut } from '../../features/authSlice';
import { resetAll } from '../../features/introSlice';
import { clearStore } from '../../features/messagesSlice';
import { clearUserStore } from '../../features/userSlice';
import { dbLogout, deleteMessageCache } from '../../utils/database';
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

  const { pubKey, walletBearer } = useSelector((state) => state.auth);
  const { pushToken } = useSelector((state) => state.user,);


  const logoutHandler = async () => {

    //clear push notifications
    const initialState = {
      status: false,
      zaps: false,
      dm: false,
      mention: false,
      reposts: false,
      likes: false,
      lntxn: false,
      token: pushToken

    };

    console.log(initialState);

    fetch(`${process.env.BASEURL}/v2/pushtoken`, {
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
    await removeData(['twitterModalShown', 'zapAmount', 'zapComment', 'relays', 'pushToken']);
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
        <CustomButton
          text="Delete Message Cache"
          buttonConfig={{ onPress: () => {deleteMessageCache();} }}
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
        v{appJson.expo.version} ({appJson.expo.ios.buildNumber})
      </Text>
    </View>
  );
};


export default SettingsHomeScreen;
