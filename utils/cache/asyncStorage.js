import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTwitterModal } from '../../features/introSlice';
import { setZapAmount } from '../../features/userSlice';
import { store } from '../../store/store';

export const storeData = async (key, value) => {
    try {
        console.log(`Storing data for key: ${key}`)
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
    const zapAmount = await getData('zapAmount')
    store.dispatch(setZapAmount(zapAmount))
    const twitterModalShown = await getData('twitterModalShown')
    store.dispatch(setTwitterModal(JSON.parse(twitterModalShown)))

};
