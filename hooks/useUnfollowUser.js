import { getEventHash, getPublicKey, signEvent } from 'nostr-tools';
import { useDispatch, useSelector } from 'react-redux';
import { unfollowPubkey } from '../features/userSlice';
import { db } from '../utils/database';
import { pool } from '../utils/nostrV2/relayPool';
import { getValue } from '../utils/secureStore';
import { getRelayObject, getRelayUrls, getWriteRelays } from '../utils/nostrV2';
import devLog from '../utils/internal';

const publishKind3 = async (oldKeys, removedKey) => {
  const filteredKeys = oldKeys.filter((key) => key !== removedKey);
  const filteredKeysTags = filteredKeys.map((key) => ['p', key, '']);
  const relayObject = getRelayObject();
  const writeUrls = getRelayUrls(getWriteRelays());
  try {
    const sk = await getValue('privKey');
    const pk = getPublicKey(sk);

    const event = {
      kind: 3,
      pubkey: pk,
      created_at: Math.floor(Date.now() / 1000),
      tags: [...filteredKeysTags],
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

export const useUnfollowUser = () => {
  const dispatch = useDispatch();
  const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
  const relays = useSelector((state) => state.user.relays);

  const unfollow = (pubkeyInHex) => {
    try {
      dispatch(unfollowPubkey(pubkeyInHex));
      try {
        const sql = `DELETE FROM followed_users WHERE pubkey = ?`;
        const params = [pubkeyInHex];
        try {
          db.transaction((tx) => {
            tx.executeSql(
              sql,
              params,
              (_, result) => {
                console.log(result);
              },
              (_, error) => {
                console.error('Delete user error', error);
                return false;
              },
            );
          });
        } catch (e) {
          console.error(e);
          console.error(e.stack);
        }
      } catch (e) {
        console.log(e);
      }
      publishKind3(followedPubkeys, pubkeyInHex, relays);
    } catch (e) {
      console.log(e);
    }
  };

  return { unfollow };
};
