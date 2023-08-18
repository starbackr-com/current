import * as SecureStore from 'expo-secure-store';

const saveValue = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

const getValue = async (key) => {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
  return undefined;
};

const deleteValue = async (key) => {
  await SecureStore.deleteItemAsync(key);
};

async function getPrivateKeyAsync() {
  const sk = await getValue('privKey');
  return sk;
}

export { saveValue, getValue, deleteValue, getPrivateKeyAsync };
