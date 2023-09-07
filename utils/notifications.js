import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      throw new Error('Permission was not granted!');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    try {
      const tokenRequest = await Notifications.getExpoPushTokenAsync();
      return tokenRequest.data;
    } catch (e) {
      console.log(e);
      throw new Error('Could not get push token from expo');
    }
  } else {
    throw new Error('Must use physical device for Push Notifications');
  }
}

async function registerPushToken(walletBearer, token) {
  const jsonBody = {
    token,
    status: true,
  };
  try {
    const response = await fetch(`${process.env.BASEURL}/v2/pushtoken`, {
      method: 'POST',
      body: JSON.stringify(jsonBody),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${walletBearer}`,
      },
    });

    const data = await response.json();
    if (data.data !== 'updated') {
      console.log(data);
      throw new Error('Server responded, but did not update');
    }
    return data;
  } catch (e) {
    console.log(e);
    throw new Error('Could not register push token with Current Service.');
  }
}

export default registerPushToken;
