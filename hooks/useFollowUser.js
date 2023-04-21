import { getEventHash, getPublicKey, signEvent } from 'nostr-tools';
import { useDispatch, useSelector } from 'react-redux';
import { followMultiplePubkeys } from '../features/userSlice';
import { db } from '../utils/database';
import { getValue } from '../utils/secureStore';
import {
  getRelayObject,
  getRelayUrls,
  getWriteRelays,
  pool,
} from '../utils/nostrV2/relays';
import devLog from '../utils/internal';

const publishKind3 = async (oldKeys, newKeys) => {
  const dedupedKeys = new Set([...oldKeys, ...newKeys]);
  const dedupedKeysTags = [...dedupedKeys].map((key) => ['p', key, '']);
  const relayObject = getRelayObject();
  const writeUrls = getRelayUrls(getWriteRelays());
  try {
    const sk = await getValue('privKey');
    const pk = getPublicKey(sk);

    const event = {
      kind: 3,
      pubkey: pk,
      created_at: Math.floor(Date.now() / 1000),
      tags: [...dedupedKeysTags],
      content: JSON.stringify(relayObject),
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, sk);
    const pubs = pool.publish(writeUrls, event);
    const success = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject();
      }, 5000);
      pubs.on('ok', () => {
        clearTimeout(timer);
        resolve(true);
      });
    });
    return success;
  } catch (e) {
    devLog(e);
  }
  return null;
};

export const useFollowUser = () => {
  const dispatch = useDispatch();
  const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

  const follow = async (pubkeysInHex) => {
    try {
      const deduped = pubkeysInHex.filter(
        (pubkey) => !followedPubkeys.includes(pubkey),
      );
      dispatch(followMultiplePubkeys(deduped));
      const timeNow = new Date().getTime() / 1000;
      deduped.forEach((pubkey) => {
        try {
          const sql = 'INSERT OR REPLACE INTO followed_users (pubkey, followed_at) VALUES (?,?)';
          const params = [pubkey, timeNow];
          try {
            db.transaction((tx) => {
              tx.executeSql(
                sql,
                params,
                undefined,
                (_, error) => {
                  devLog('Save user error', error);
                  return false;
                },
              );
            });
          } catch (e) {
            devLog(e);
          }
        } catch (e) {
          devLog(e);
        }
      });
      publishKind3(followedPubkeys, pubkeysInHex);
    } catch (e) {
      devLog(e);
    }
  };

  return { follow };
};

export default useFollowUser;
