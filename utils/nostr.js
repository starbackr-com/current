import { getPublicKey, getEventHash, signEvent } from "nostr-tools";
import { getValue } from "./secureStore";
import relay from "./nostr/initRelay";
import { Event } from "./nostr/Event";
import { store } from "../store/store";

let retries = 0;

export const getEvents = async (url) => {
    const pubkeys = store.getState().user.followedPubkeys;
    retries++;
    if (relay.status === 1) {
        retries = 0;

        let sub = relay.sub([
            {
                authors: pubkeys,
                kinds: [1],
                limit: 200,
            },
        ]);

        sub.on("event", (event) => {
            const newEvent = new Event(event);
            newEvent.save();
        });
    } else if (retries > 10) {
        alert("Cannot establish Relay connection...");
        return;
    } else {
        console.log("Retrying");
        setTimeout(() => {
            getEvents();
        }, 1000);
    }
};


export const getFeed = async (pubkeys) => {
    const promise = new Promise((resolve, reject) => {
        if (relay.status === 1) {
            let sub = relay.sub([
                {
                    authors: pubkeys,
                    kinds: [1],
                    limit: 75,
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
        } else {
            reject('Not connected to Relay...')
        }
    });
    return promise
};

export const getReplies = async (parentId) => {
    const promise = new Promise((resolve, reject) => {
        const replies = []
        if (relay.status === 1) {
            let sub = relay.sub([
                {
                    kinds: [1],
                    '#e': [parentId]
                },
            ]);

            sub.on("event", (event) => {
                replies.push(event)
                console.log(event)
            });
            sub.on("eose", () => {
                sub.unsub();
                resolve(replies);
            });
        } else {
            reject('Not connected to Relay...')
        }
    });
    return promise
};

export const postEvent = async (content) => {
    try {
        let privKey = await getValue("privKey");
        if (!privKey) {
            throw new Error("No privKey in secure storage found");
        }
        let pubKey = getPublicKey(privKey);
        console.log(pubKey);
        let event = {
            kind: 1,
            pubkey: pubKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content,
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);

        let pub = relay.publish(event);
        pub.on("ok", () => {
            alert(`${relay.url} has accepted our event`);
        });
        pub.on("seen", () => {
            console.log(`we saw the event on ${relay.url}`);
        });
        pub.on("failed", (reason) => {
            console.log(`failed to publish to ${relay.url}: ${reason}`);
        });
    } catch (err) {
        console.log(err);
    }
};
