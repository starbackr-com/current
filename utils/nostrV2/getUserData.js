import { store } from "../../store/store";
import { Event } from "./Event";
import { connectedRelays } from "./initRelays";

export const updateFollowedUsers = async () => {
    const pubkeys = store.getState().user.followedPubkeys;
    return Promise.allSettled(
        connectedRelays.map(
            (relay) =>
                new Promise((resolve, reject) => {
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
                        resolve();
                    });
                    setTimeout(() => {
                        console.log(`${relay.url} timed out after 10 sec...`)
                        reject();
                    }, 10000)
                })
        )
    );
};
