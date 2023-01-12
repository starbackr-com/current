import * as SecureStore from 'expo-secure-store';

const saveValue = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
};

const getValue = async (key) => {
    let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return undefined
  }
};

const deleteValue = async (key) => {
  await SecureStore.deleteItemAsync(key)
}

export {saveValue, getValue, deleteValue}