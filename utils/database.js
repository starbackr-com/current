import * as SQLite from 'expo-sqlite';
import { addZap } from '../features/interactionSlice';
import { hydrate } from '../features/messagesSlice';
import { followMultiplePubkeys, mutePubkey } from '../features/userSlice';
import { store } from '../store/store';
import * as Sentry from 'sentry-expo';

const openDatabase = () => SQLite.openDatabase('current.db');
export const db = openDatabase();

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
  `
    CREATE TABLE IF NOT EXISTS zapped_posts (
    eventId TEXT PRIMARY KEY NOT NULL)`,
  `
    CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY NOT NULL,
    conversation TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INT NOT NULL,
    kind INT NOT NULL,
    pubkey TEXT NOT NULL,
    sig TEXT NOT NULL,
    tags TEXT NOT NULL)`,
];

export const init = async () => {
  try {
    db.transaction(async (tx) => {
      initArray.forEach((table) => tx.executeSql(table));
    });
  } catch (error) {
    Sentry.Native.captureException(error);
  }
};

export const getUsersFromDb = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT pubkey FROM users',
        [],
        (_, { rows: { _array } }) => {
          const pubkeys = _array.map((row) => row.pubkey);
          resolve(pubkeys);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
  return promise;
};

export const hydrateFromDatabase = async () => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM users',
      [],
      (_, { rows: { _array } }) => {
        const usersObj = {};
        _array.forEach((user) => {
          usersObj[user.pubkey] = user;
        });
        store.dispatch(hydrate(usersObj));
      },
      (_, error) => {
        console.log('Error querying users', error);
        return false;
      },
    );
    tx.executeSql(
      'SELECT pubkey FROM followed_users',
      [],
      (_, { rows: { _array } }) => {
        const pubkeys = _array.map((row) => row.pubkey);
        store.dispatch(followMultiplePubkeys(pubkeys));
      },
      (_, error) => {
        console.log('Error querying users', error);
        return false;
      },
    );
    tx.executeSql(
      'SELECT pubkey FROM muted_users',
      [],
      (_, { rows: { _array } }) => {
        _array.forEach((row) => {
          store.dispatch(mutePubkey(row.pubkey));
        });
      },
      (_, error) => {
        console.log('Error querying users', error);
        return false;
      },
    );
    tx.executeSql(
      'SELECT eventId from zapped_posts',
      [],
      (_, { rows: { _array } }) => {
        const zapIds = _array.map((row) => row.eventId);
        store.dispatch(addZap(zapIds));
      },
      () => {},
    );
  });
};

export const dbLogout = async () => {
  db.transaction((tx) => {
    tx.executeSql('DELETE FROM followed_users');
  });
};

export const dbAddZap = (eventId) => {
  const sql = 'INSERT OR REPLACE INTO zapped_posts (eventId) VALUES (?)';
  const params = [eventId];
  try {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        () => {
          console.log('Successfully added to DB');
        },
        (_, error) => {
          console.error(error);
        },
      );
    });
  } catch (e) {
    console.log(e);
  }
};

export const dbAddMessage = (
  id,
  conversation,
  content,
  createdAt,
  kind,
  pubkey,
  sig,
  tags,
) => {
  const sql =
    'INSERT OR REPLACE INTO messages (id, conversation, content, created_at, kind, pubkey, sig, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    id,
    conversation,
    content,
    createdAt,
    kind,
    pubkey,
    sig,
    tags,
  ];
  try {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        () => {
          console.log('Successfully added to DB');
        },
        (_, error) => {
          console.error(error);
        },
      );
    });
  } catch (e) {
    console.log(e);
  }
};

export const getMessagesFromDb = (conversationId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages WHERE conversation = "${conversationId}"`,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
  return promise;
};

export const deleteMessageCache = (conversationId) => {
  if (conversationId) {
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM messages WHERE conversation = "${conversationId}"`);
    });
  } else {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM messages');
    });
  }
};
