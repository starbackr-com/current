import { View } from 'react-native';
import React, { useState } from 'react';
import { colors, globalStyles } from '../../styles';
import { SwitchBar } from '../../components';
import registerPushToken from '../../utils/notifications';

const initialState = {
  zaps: true,
  messages: true,
  mentions: true,
  reposts: true,
  lightning: true,
};

const SettingsNotifcationsScreen = () => {
  const [notificationSettings, setNotificationSettings] =
    useState(initialState);
  const [pushActive, setPushActive] = useState(false);

  return (
    <View style={globalStyles.screenContainer}>
      <SwitchBar
        text="Enable Push Notifications"
        value={pushActive}
        onChange={async () => {
          try {
            if (!pushActive) {
              await registerPushToken();
            }
            setPushActive((prev) => !prev);
          } catch (e) {
            setPushActive(false);
          }
        }}
      />
      <View style={{ width: '100%', marginTop: 16 }}>
        <SwitchBar
          text="Zaps"
          value={notificationSettings.zaps}
          onChange={() => {
            setNotificationSettings((prev) => ({ ...prev, zaps: !prev.zaps }));
          }}
          disabled={!pushActive}
        />
        <SwitchBar
          text="Direct Messages"
          value={notificationSettings.messages}
          onChange={() => {
            setNotificationSettings((prev) => ({
              ...prev,
              messages: !prev.messages,
            }));
          }}
          disabled={!pushActive}
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
          disabled={!pushActive}
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
          disabled={!pushActive}
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
          disabled={!pushActive}
        />
      </View>
    </View>
  );
};

export default SettingsNotifcationsScreen;
