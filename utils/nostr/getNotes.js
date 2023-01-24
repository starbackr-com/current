import relay from "./initRelay";
import { db, getUsersFromDb } from "../database";
import { Event } from "./Event";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData, storeData } from "../cache/asyncStorage";

export const updateUsers = async (url) => {
    const pubkeys = await getUsersFromDb();
    if (relay.status === 1) {
        let sub = relay.sub([
            {
                authors: pubkeys,
                kinds: [0],
            },
        ]);

        sub.on("event", (event) => {
            const newEvent = new Event(event);
            newEvent.save();
        });
        sub.on('eose', () => {
            sub.unsub();
        })
    } else {
        console.log("Not connected to a relay");
    }
};
