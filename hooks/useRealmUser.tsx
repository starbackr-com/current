import Realm from 'realm';
import { useQuery, useRealm } from '@realm/react';
import { User } from '../schemas';
import { useEffect } from 'react';
import { pool } from '../utils/nostrV2';
import { useRelayUrls } from '../features/relays';

const useRealmUser = (pubkey) => {
  console.log(pubkey)
  const users = useQuery(User);
  const [user] = users.filtered(`pubkey == "${pubkey}"`);
  console.log(user)
  const realm = useRealm();
  const { readUrls } = useRelayUrls();
  useEffect(() => {
    let sub;
    if (!user) {
      sub = pool.sub(readUrls, [{ kinds: [0], authors: [pubkey], limit: 1 }]);
      sub.on('event', (event) => {
        if (!event.content) {
          return;
        }
        const metadata = JSON.parse(event.content);
        try {
          realm.write(() => {
            const user = realm.create<User>(
              User,
              {
                _id: new Realm.BSON.ObjectID(),
                pubkey: event.pubkey,
                updatedAt: event.created_at,
                name: metadata.name,
                picture: metadata.picture,
              },
              'all',
            );
          });
        } catch (e) {
          console.log(e);
        }
      });
    }
    return () => {
      if (sub) {
        sub.unsub();
      }
    };
  }, [user]);
  return user;
};

export default useRealmUser;
