import { connectedRelays } from "./relay";
import { Event } from "./Event";
const allSettled = require('promise.allsettled');

export const getHomeFeed = async (pubkeys) => {
    console.log('Homefeed...')
    return allSettled(
        connectedRelays.map((relay) => new Promise((resolve, reject) => {
            let sub = relay.sub([
                {
                    authors: pubkeys,
                    kinds: [1],
                    limit: 50
                },
            ]);
            const timer = setTimeout(() => {
                reject();
                return
            }, 5000)
            sub.on("event", (event) => {
                const newEvent = new Event(event);
                newEvent.save();
            });
            sub.on("eose", () => {
                sub.unsub();
                clearTimeout(timer)
                resolve();
                return;
            });
        }))
    );
};
