import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("current.db");

export const init = async () => {
    try {
        db.transaction(async (tx) => {
          for (const table of initArray) {
            tx.executeSql(table)
          }
          console.log('DB init success!')
        })
      } catch (error) {
        console.error('DB init error: ', error)
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
  ]
