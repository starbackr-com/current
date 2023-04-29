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
  status: false,
  zaps: false,
  dm: false,
  mention: false,
  reposts: false,
  likes: false,
  lntxn: false

};

const SettingsNotifcationsScreen = () => {


  const dispatch = useDispatch();
  const [notificationSettings, setNotificationSettings] = useState(initialState);
  const [pushTokenInput, setPushTokenInput] = useState();

  const { pushToken } = useSelector(
    (state) => state.user,
  );

  const { pubKey, walletBearer } = useSelector((state) => state.auth);

  const getNotificationSettings = () => {

    fetch(`${process.env.BASEURL}/v2/pushtoken/` + pushToken, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${walletBearer}`,
    },
    }).then((response) => response.json())
      .then((jsonData) => {
      if (jsonData.length > 0) setNotificationSettings(jsonData[0]);

      })

  };


  useEffect(
    () => {
      if (!pushTokenInput) {
          console.log('inside getNotificationSettings');
          getNotificationSettings();

      } else {

        let jsonBody = notificationSettings;
        jsonBody.token = pushTokenInput;
        console.log(jsonBody);

        fetch(`${process.env.BASEURL}/v2/pushtoken`, {
          method: 'POST',
          body: JSON.stringify(jsonBody),
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${walletBearer}`,
          },
        });


      }

      console.log(notificationSettings);
      setPushTokenInput(pushToken);

    },
    [notificationSettings],
  );

  console.log('push token from storage: ', pushTokenInput);
  console.log(pubKey);

  return (
    <ScrollView style={globalStyles.screenContainerScroll}>
    <Text style={globalStyles.textH2}>Push Notifications</Text>

      <SwitchBar
        text="Allow Notifications"
        value={pushTokenInput?true:false}
        onChange={async () => {
          try {
            if (!pushTokenInput) {
              //const token = await registerPushToken(walletBearer);

              //Enable testng this on Simulator...
              const token = 'ExponentPushToken[cmUeZ_N1zwYu3cWEG8xtwp]';
              if (token) {
                console.log('token is: ', token);
                await storeData('pushToken', token);
                dispatch(setPushToken(token));
                setPushTokenInput(token);
                setNotificationSettings((prev) => ({
                  ...prev,
                  status: !prev.status,
                }));
              }

            } else {
              await storeData('pushToken', '');
              dispatch(setPushToken(''));
              setPushTokenInput('');
              setNotificationSettings(initialState);

            }

          } catch (e) {
            console.log(e);
          }
        }}
      />
      <View style={{ width: '100%', marginTop: 16 }}>


        <SwitchBar
          text="Direct Messages"
          value={notificationSettings.dm}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              dm: !prev.dm,
            }));
          }}
          disabled={!pushToken}
        />

        <SwitchBar
          text="Lightning Transactions"
          value={notificationSettings.lntxn}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              lntxn: !prev.lntxn,
            }));
          }}
          disabled={!pushToken}
        />

        <SwitchBar
          text="Zaps"
          value={notificationSettings.zaps}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              zaps: !prev.zaps,
            }));
          }}
          disabled={!pushToken}
        />
        <SwitchBar
          text="Mentions"
          value={notificationSettings.mention}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              mention: !prev.mention,
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
          value={notificationSettings.likes}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              likes: !prev.likes,
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
