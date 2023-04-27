import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors, globalStyles } from '../../styles';
import { SwitchBar } from '../../components';
import registerPushToken from '../../utils/notifications';
import { useDispatch, useSelector } from "react-redux";
import { storeData } from '../../utils/cache/asyncStorage';
import { setPushToken } from '../../features/userSlice';
import { ScrollView } from 'react-native-gesture-handler';



const initialState = {
  push: false,
  zaps: false,
  messages: false,
  mentions: false,
  reposts: false,
  likes: false,
  lightning: false,

};

const SettingsNotifcationsScreen = () => {
  const dispatch = useDispatch();
  const [notificationSettings, setNotificationSettings] =
    useState(initialState);
  const [pushActive, setPushActive] = useState();
  const [pushTokenInput, setPushTokenInput] = useState();

  const { pushToken } = useSelector(
    (state) => state.user,
  );

  const { pubKey, walletBearer } = useSelector((state) => state.auth);

  useEffect(
    () => {
      setPushTokenInput(pushToken);
    },
    [pushToken],
  );

  console.log('push token from storage: ', pushTokenInput);


  return (
    <ScrollView style={globalStyles.screenContainerScroll}>
    <Text style={globalStyles.textH2}>Push Notifications</Text>

      <SwitchBar
        text="Allow Notifications"
        value={pushTokenInput?true:false}
        onChange={async () => {
          try {
            if (!pushTokenInput) {
              const token = await registerPushToken(walletBearer);
              if (token) {
                console.log('token is: ', token);
                await storeData('pushToken', token);
                dispatch(setPushToken(token));
                setPushActive(true);
              }

            } else {
              await storeData('pushToken', '');
              dispatch(setPushToken(''));
              setPushTokenInput('');

            }



          } catch (e) {
            console.log(e);
            setPushActive(false);
          }
        }}
      />
      <View style={{ width: '100%', marginTop: 16 }}>


        <SwitchBar
          text="Direct Messages"
          value={notificationSettings.messages}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              messages: !prev.messages,
            }));
          }}
          disabled={!pushToken}
        />

        <SwitchBar
          text="Lightning Transactions"
          value={notificationSettings.lightning}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              lightning: !prev.lightning,
            }));
          }}
          disabled={!pushToken}
        />

        <SwitchBar
          text="Zaps"
          value={notificationSettings.zaps}
          onChange={() => {
            setNotificationSettings((prev) => ({ ...prev, zaps: !prev.zaps }));
          }}
          disabled={!pushToken}
        />
        <SwitchBar
          text="Mentions"
          value={notificationSettings.mentions}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              mentions: !prev.mentions,
            }));
          }}
          disabled={!pushToken}
        />
        <SwitchBar
          text="Reposts"
          value={notificationSettings.reposts}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              reposts: !prev.reposts,
            }));
          }}
          disabled={!pushToken}
        />
        <SwitchBar
          text="Likes"
          value={notificationSettings.reposts}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              reposts: !prev.reposts,
            }));
          }}
          disabled={!pushToken}
        />


        <Text style={globalStyles.textBody}>
            Push notification is a premium service that allows you to receive notifications directly from Nostr Current relays.
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsNotifcationsScreen;
