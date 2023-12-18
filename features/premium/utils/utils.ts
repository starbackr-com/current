import { Platform } from 'react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { store } from '../../../store/store';
import { setPremium } from '../../authSlice';

export async function initRC(userId: string) {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'macos') {
      try {
        const res = await fetch(`https://getcurrent.io/subscribers/${userId}`);
        const data = await res.json();
        if (!data) {
          throw new Error('Subscribers Endpoint returned invalid reponse');
        }
        if (data.active) {
          store.dispatch(setPremium(true));
          return;
        }
      } catch (e) {
        console.log('Failed to get subscriber status from endpoint: ', e);
      }
      Purchases.configure({
        apiKey: process.env.RC_IOS_KEY,
        appUserID: userId,
      });
      const customerInfo = await getCustomerInfo();
      if (customerInfo && customerInfo.entitlements.active.Pleb !== undefined) {
        store.dispatch(setPremium(true));
      }
    }
    if (Platform.OS === 'android') {
      store.dispatch(setPremium(true));
      return;
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getProducts(): Promise<PurchasesOffering> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getCustomerInfo() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (e) {
    console.log(e);
  }
}

export async function purchaseSubscription() {
  const offerings = await getProducts();
  const [pack] = offerings.availablePackages;
  try {
    const { customerInfo } = await Purchases.purchasePackage(pack);
    if (typeof customerInfo.entitlements.active.Pleb !== 'undefined') {
      store.dispatch(setPremium(true));
    }
  } catch (e) {
    if (e.userCancelled) {
      alert('Transaction cancelled!');
    }
    if (!e.userCancelled) {
      alert('Something went wrong...');
      console.log(e);
    }
  }
}

export async function getSatProducts() {
  try {
    const rcProducts = await Purchases.getProducts(['sats_1usd']);
    return rcProducts;
  } catch (e) {
    console.log(e);
    return [];
  }
}
