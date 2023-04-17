import { sha256 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';
import { getPublicKey } from 'nostr-tools';
import { store } from '../store/store';
import { walletApi } from '../services/walletApi';
import { generateRandomString } from './cache/asyncStorage';
import devLog from './internal';

const utf8Encoder = new TextEncoder();

export const createWallet = async (privKey, address) => {
  try {
    if (!privKey) {
      throw new Error('Expected to get a valid private key');
    }
    console.log(privKey);
    console.log(address);
    const pubKey = await getPublicKey(privKey);
    const password = secp256k1.utils.bytesToHex(
      sha256(utf8Encoder.encode(privKey)),
    );
    const result = await store
      .dispatch(
        walletApi.endpoints.postNewWallet.initiate({
          login: pubKey,
          password,
          username: address,
        }),
      )
      .unwrap();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

export const loginToWallet = async (privKey) => {
  try {
    if (!privKey) {
      throw new Error('Expected to get a valid private key');
    }
    try {
      const appId = await generateRandomString();
      devLog(appId);
    } catch (e) {
      devLog(e);
    }
    const pubKey = await getPublicKey(privKey);
    const password = secp256k1.utils.bytesToHex(
      sha256(utf8Encoder.encode(privKey)),
    );
    const result = await store.dispatch(
      walletApi.endpoints.postLogin.initiate({
        login: pubKey,
        password,
      }),
    );
    // if (result?.error?.status === 400) {
    //     throw new Error(`Invalid Credentials`)
    // }
    return result;
  } catch (e) {
    devLog(e);
  }
};

export const deleteWallet = async (privKey, address) => {
  try {
    if (!privKey) {
      throw new Error('Expected to get a valid private key');
    }
    const pubKey = await getPublicKey(privKey);
    const password = secp256k1.utils.bytesToHex(
      sha256(utf8Encoder.encode(privKey)),
    );
    const result = await store.dispatch(
      walletApi.endpoints.deleteWallet.initiate({
        login: pubKey,
        password,
        username: address,
      }),
    );
    // if (result?.error?.status === 400) {
    //     throw new Error(`Invalid Credentials`)
    // }
    return result;
  } catch (err) {
    console.log(err);
  }
};
