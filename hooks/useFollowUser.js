import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { useDispatch, useSelector } from "react-redux";
import { followMultiplePubkeys } from "../features/userSlice";
import { db } from "../utils/database";
import { connectedRelayPool, pool } from "../utils/nostrV2/relayPool";
import { getValue } from "../utils/secureStore";

const publishKind3 = async (oldKeys, newKeys, relays) => {
    const dedupedKeys = new Set([...oldKeys, ...newKeys]);
    const dedupedKeysTags = [...dedupedKeys].map((key) => ["p", key, ""]);
    try {
        const sk = await getValue("privKey");
        const pk = getPublicKey(sk);

        let event = {
            kind: 3,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [...dedupedKeysTags],
            content: JSON.stringify(relays),
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);
        const urls = connectedRelayPool.map((relay) => relay.url);
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

export const useFollowUser = () => {
    const dispatch = useDispatch();
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    const relays = useSelector(state => state.user.relays)

    const follow = async (pubkeysInHex) => {
        try {
            const deduped = pubkeysInHex.filter(
                (pubkey) => !followedPubkeys.includes(pubkey)
            );
            dispatch(followMultiplePubkeys(deduped));
            const sql = `INSERT OR REPLACE INTO followed_users (pubkey, followed_at) VALUES (?,?)`;
            const timeNow = new Date().getTime() / 1000;
            deduped.forEach((pubkey) => {
                try {
                    const sql = `INSERT OR REPLACE INTO followed_users (pubkey, followed_at) VALUES (?,?)`;
                    const params = [pubkey, timeNow];
                    try {
                        db.transaction((tx) => {
                            tx.executeSql(
                                sql,
                                params,
                                (_, result) => {
                                    console.log(result);
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
            });
            publishKind3(followedPubkeys, pubkeysInHex, relays);
        } catch (e) {
            console.log(e);
        }
    };

    return { follow };
};
