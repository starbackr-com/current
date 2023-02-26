import { removeAuthorsMessages } from "../features/messagesSlice";
import {
    followMultiplePubkeys,
    followPubkey,
    mutePubkey,
    unfollowPubkey,
    unmutePubkey,
} from "../features/userSlice";
import { store } from "../store/store";
import { db } from "./database";

export const followUser = async (pubkeyInHex) => {
    try {
        store.dispatch(followPubkey(pubkeyInHex));
        const sql = `INSERT OR REPLACE INTO followed_users (pubkey, followed_at) VALUES (?,?)`;
        const timeNow = new Date().getTime() / 1000;
        const params = [pubkeyInHex, timeNow];
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
};

export const unfollowUser = async (pubkeyInHex) => {
    store.dispatch(unfollowPubkey(pubkeyInHex));
    store.dispatch(removeAuthorsMessages(pubkeyInHex));
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
                (error) => {
                    console.log(error);
                }
            );
        });
    } catch (e) {
        console.log(e);
    }
};

export const followMultipleUsers = async (pubkeysInHex) => {
    store.dispatch(followMultiplePubkeys(pubkeysInHex));
    pubkeysInHex.forEach((pubkey) => {
        try {
            const sql = `INSERT OR REPLACE INTO followed_users (pubkey, followed_at) VALUES (?,?)`;
            const timeNow = new Date().getTime() / 1000;
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
};

export const muteUser = async (pubkeyInHex) => {
    try {
        await unfollowUser(pubkeyInHex)
        store.dispatch(mutePubkey(pubkeyInHex));
        const sql = `INSERT OR REPLACE INTO muted_users (pubkey) VALUES (?)`;
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
                        console.error("Mute user error", error);
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

export const unmuteUser = async (pubkeyInHex) => {
    try {
        store.dispatch(unmutePubkey(pubkeyInHex));
        const sql = `DELETE FROM muted_users WHERE pubkey = ?`;
        const params = [pubkeyInHex];
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    sql,
                    params,
                    (_, result) => {
                        console.log(result);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            });
        } catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
};
