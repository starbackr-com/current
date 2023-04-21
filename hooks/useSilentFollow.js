import { useDispatch, useSelector } from 'react-redux';
import { followMultiplePubkeys } from '../features/userSlice';
import { db } from '../utils/database';

const useSilentFollow = () => {
  const dispatch = useDispatch();
  const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

  const silentFollow = async (pubkeysInHex) => {
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
              tx.executeSql(sql, params, undefined, (_, error) => {
                console.error('Save user error', error);
                return false;
              });
            });
          } catch (e) {
            console.error(e);
            console.error(e.stack);
          }
        } catch (e) {
          console.log(e);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return silentFollow;
};

export default useSilentFollow;
