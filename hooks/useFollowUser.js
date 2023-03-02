import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { useDispatch, useSelector } from "react-redux";
import { followMultiplePubkeys } from "../features/userSlice";
import { db } from "../utils/database";
import { relays } from "../utils/nostrV2";
import { pool } from "../utils/nostrV2/relayPool";
import { getValue } from "../utils/secureStore";

const publishKind3 = async (oldKeys, newKeys) => {
    oldKeysTags = oldKeys.map((key) => ["p", key, ""]);
    newKeysTags = newKeys.map((key) => ["p", key, ""]);
    console.log(oldKeysTags.length);
    console.log(newKeysTags.length);
    try {
        const sk = await getValue("privKey");
        const pk = getPublicKey(sk);

        let event = {
            kind: 3,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [...oldKeysTags, ...newKeysTags],
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

export const useFollowUser = () => {
    const dispatch = useDispatch();
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

    const follow = async (pubkeysInHex) => {
        try {
            dispatch(followMultiplePubkeys(pubkeysInHex));
            const sql = `INSERT OR REPLACE INTO followed_users (pubkey, followed_at) VALUES (?,?)`;
            const timeNow = new Date().getTime() / 1000;
            pubkeysInHex.forEach((pubkey) => {
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
            publishKind3(followedPubkeys, pubkeysInHex);
        } catch (e) {
            console.log(e);
        }
    };

    return { follow };
};
