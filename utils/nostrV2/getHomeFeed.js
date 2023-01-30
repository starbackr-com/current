import { connectedRelays } from "./initRelays";
import { Event } from "./Event";

export const getHomeFeed = async (pubkeys) => {
    return Promise.allSettled(
        connectedRelays.map((relay) => new Promise((resolve, reject) => {
            let sub = relay.sub([
                {
                    authors: pubkeys,
                    kinds: [1],
                    limit: 50
                },
            ]);
            sub.on("event", (event) => {
                const newEvent = new Event(event);
                newEvent.save();
            });
            sub.on("eose", () => {
                sub.unsub();
                resolve();
            });
            setTimeout(() => {
                reject()
            }, 5000)
        }))
    );
};
