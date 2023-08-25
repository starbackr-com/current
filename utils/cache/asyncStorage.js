import AsyncStorage from '@react-native-async-storage/async-storage';
import { joinCommunity } from '../../features/community/communitySlice';
import { setGetStartedItems, setTwitterModal } from '../../features/introSlice';
import {
  setZapAmount,
  setZapNoconf,
  setZapComment,
  setPushToken,
} from '../../features/userSlice';
import { store } from '../../store/store';
import { getValue } from '../secureStore';
import { addLike, addRepost } from '../../features/interactionSlice';

export const generateRandomString = async (length) => {
  const value = await AsyncStorage.getItem('appId');

  if (!value) {
    const char =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    const random = Array.from(
      { length },
      () => char[Math.floor(Math.random() * char.length)],
    );
    const randomString = random.join('');
    await AsyncStorage.setItem('appId', randomString);
    return randomString;
  }
  return value;
};

export const storeData = async (key, value) => {
  try {
    console.log(`Storing data for key: ${key}`);
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    throw new Error(`Error while storing item: ${e}`);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    throw new Error(`Error while retrieving item: ${e}`);
  }
};

export const hydrateStore = async () => {
  const zapAmount = await getData('zapAmount');
  const zapComment = await getData('zapComment');
  const zapNoconf = await getData('zapNoconf');
  const pushToken = await getData('pushToken');
  const joinedCommunities = await getData('joinedCommunities');
  const twitterModalShown = await getData('twitterModalShown');
  const getStartedItemsShown = await getData('getStartedItemsShown');
  const likedEvents = await getData('likedEvents');
  const repostedEvents = await getData('repostedEvents');
  if (zapAmount) {
    store.dispatch(setZapAmount(zapAmount));
  }
  if (zapComment) {
    store.dispatch(setZapComment(zapComment));
  }
  if (zapNoconf) {
    store.dispatch(setZapNoconf(zapNoconf));
  }
  if (pushToken) {
    store.dispatch(setPushToken(pushToken));
  }
  if (twitterModalShown) {
    store.dispatch(setTwitterModal(JSON.parse(twitterModalShown)));
  }
  if (getStartedItemsShown) {
    const array = JSON.parse(getStartedItemsShown);
    array.forEach((id) => store.dispatch(setGetStartedItems(id)));
  }
  if (joinedCommunities) {
    const array = JSON.parse(joinedCommunities);
    array.forEach((slug) => {
      console.log('adding community')
      store.dispatch(joinCommunity(slug));
    });
  }
  if (likedEvents) {
    const array = JSON.parse(likedEvents);
    store.dispatch(addLike(array));
  }
  if (repostedEvents) {
    const array = JSON.parse(repostedEvents);
    store.dispatch(addRepost(array));
  }
};

export const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {}

  console.log(keys);
};

export const removeData = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    // remove error
  }

  console.log(`Removed ${keys} from AsyncStorage`);
};

export async function getPrivateKey() {
  const sk = await getValue('privKey');
  return sk;
}
