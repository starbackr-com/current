import * as SQLite from "expo-sqlite";
import { addUser, hydrate } from "../features/messagesSlice";
import { followMultiplePubkeys, followPubkey, mutePubkey } from "../features/userSlice";
import { store } from "../store/store";

const openDatabase = () => SQLite.openDatabase("current.db");
export const db = openDatabase();

export const init = async () => {
    try {
        db.transaction(async (tx) => {
            for (const table of initArray) {
                tx.executeSql(table);
            }
            console.log("DB init success!");
        });
    } catch (error) {
        console.error("DB init error: ", error);
    }
};

const initArray = [
    `
    CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY NOT NULL,   
    content TEXT NOT NULL,
    created_at INT NOT NULL,
    kind INT NOT NULL,
    pubkey TEXT NOT NULL,
    sig TEXT NOT NULL,
    tags TEXT NOT NULL)`,
    `
    CREATE TABLE IF NOT EXISTS users (
    pubkey TEXT PRIMARY KEY NOT NULL,
    id TEXT NOT NULL,   
    name TEXT,
    display_name TEXT,
    picture TEXT,
    about TEXT,
    created_at INT,
    lud06 TEXT,
    lud16 TEXT,
    nip05 TEXT)`,
    `
    CREATE TABLE IF NOT EXISTS followed_users (
    pubkey TEXT PRIMARY KEY NOT NULL,
    followed_at INT NOT NULL)`,
    `
    CREATE TABLE IF NOT EXISTS muted_users (
    pubkey TEXT PRIMARY KEY NOT NULL)`,
];

export const getUsersFromDb = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT pubkey FROM users",
                [],
                (_, { rows: { _array } }) => {
                    pubkeys = _array.map((row) => row.pubkey);
                    resolve(pubkeys);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
    return promise;
};

export const hydrateFromDatabase = async () => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM users",
            [],
            (_, { rows: { _array } }) => {
                const usersObj = {}
                _array.forEach((user) => {
                    usersObj[user.pubkey] = user
                });
                store.dispatch(hydrate(usersObj))
            },
            (_, error) => {
                console.log("Error querying users", error);
                return false;
            }
        );
        tx.executeSql(
            "SELECT pubkey FROM followed_users",
            [],
            (_, { rows: { _array } }) => {
                const pubkeys = _array.map((row) => row.pubkey);
                store.dispatch(followMultiplePubkeys(pubkeys))
            },
            (_, error) => {
                console.log("Error querying users", error);
                return false;
            }
        );
        tx.executeSql(
            "SELECT pubkey FROM muted_users",
            [],
            (_, { rows: { _array } }) => {
                const pubkeys = _array.map((row) => {
                    store.dispatch(mutePubkey(row.pubkey));
                });
            },
            (_, error) => {
                console.log("Error querying users", error);
                return false;
            }
        );
    });
};

export const dbLogout = async () => {
    db.transaction((tx) => {
        tx.executeSql("DELETE FROM followed_users");
    });
};
