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
        sub.on("eose", () => {
            sub.unsub();
        });
    } else {
        console.log("Not connected to a relay");
    }
};

export const getUserData = (pubkey) => {
        if (relay.status === 1) {
            console.log(pubkey);
            let lol = relay.sub([
                {
                    authors: [
                        "d307643547703537dfdef811c3dea96f1f9e84c8249e200353425924a9908cf8",
                    ],
                    kinds: [0],
                },
            ]);

            lol.on("event", (event) => {
                console.log(event);
                const newEvent = new Event(event);
                newEvent.save();
            });
            lol.on("eose", () => {
                console.log("eose");
                sub.unsub();
                resolve();
            });
        } else {
            reject("Not connected to a relay");
        }
};
