import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

export function initRC() {
  try {
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: process.env.RC_IOS_KEY });
      console.log(process.env.RC_IOS_KEY)
      getProducts();
    }
    if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: process.env.RC_ANDROID_KEY });
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getProducts() {
  try {
    const offerings = await Purchases.getOfferings();
    console.log(offerings.current);
  } catch (e) {
    console.log(e)
    return null;
  }
}
