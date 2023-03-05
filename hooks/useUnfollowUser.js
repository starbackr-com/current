import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { useDispatch, useSelector } from "react-redux";
import { unfollowPubkey } from "../features/userSlice";
import { db } from "../utils/database";
import { relays } from "../utils/nostrV2";
import { pool } from "../utils/nostrV2/relayPool";
import { getValue } from "../utils/secureStore";

const publishKind3 = async (oldKeys, removedKey) => {
    filteredKeys = oldKeys.filter(key => key != removedKey)
    filteredKeysTags = filteredKeys.map((key) => ["p", key, ""]);
    try {
        const sk = await getValue("privKey");
        const pk = getPublicKey(sk);

        let event = {
            kind: 3,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [...filteredKeysTags],
            content: "",
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);
        const urls = relays.map((relay) => relay.url);
        let pubs = pool.publish(urls, event);
        const success = await new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                reject();
                return;
            }, 5000);
            pubs.on("ok", () => {
                clearTimeout(timer);
                resolve(true);
            });
        });
        return success;
    } catch (e) {
        console.log(e);
    }
};

export const useUnfollowUser = () => {
    const dispatch = useDispatch();
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

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
                                    console.error("Delete user error", error);
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
            publishKind3(followedPubkeys, pubkeyInHex);
        } catch (e) {
            console.log(e);
        }
    };

    return { unfollow };
};
