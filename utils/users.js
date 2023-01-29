import { followPubkey, unfollowPubkey } from "../features/userSlice";
import { store } from "../store/store";
import { db } from "./database";
import { getUserData } from "./nostr/getNotes";

export const followUser = async (pubkeyInHex) => {
    try {
        getUserData(pubkeyInHex);
        store.dispatch(followPubkey(pubkeyInHex))
        const sql = `INSERT OR REPLACE INTO followed_users (pubkey, followed_at) VALUES (?,?)`;
        const timeNow = new Date().getTime() / 1000;
        const params = [pubkeyInHex, timeNow];
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    sql,
                    params,
                    (_, result) => {
                        console.log(result)
                    },
                    (_, error) => {
                        console.error("Save user error", error);
                        return false;
                    }
                );
            });
        } catch (e) {
            console.error(e);
            console.error(e.stack);
        }
    } catch (e) {
        console.log(e);
    }
};

export const unfollowUser = async (pubkeyInHex) => {
    store.dispatch(unfollowPubkey(pubkeyInHex))
    const sql = `DELETE FROM followed_users WHERE pubkey = ?`;
    const params = [pubkeyInHex];
    try {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (_, result ) => {
                    console.log(result)
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    } catch (e) {
        console.log(e);
    }
};
