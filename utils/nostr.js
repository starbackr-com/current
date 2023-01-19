import { getPublicKey, getEventHash, signEvent } from "nostr-tools";
import { getValue } from "./secureStore";
import relay from "./nostr/initRelay";
import { Event } from "./nostr/Event";

let retries = 0;

export const getEvents = async (url, pubkeys) => {
    retries++;
    if (relay.status === 1) {
        retries = 0;

        let sub = relay.sub([
            {
                authors: [
                    "d307643547703537dfdef811c3dea96f1f9e84c8249e200353425924a9908cf8",
                ],
                kinds: [1],
                limit: 100,
            },
            {
                authors: [
                    "d307643547703537dfdef811c3dea96f1f9e84c8249e200353425924a9908cf8",
                ],
                kinds: [0],
            },
        ]);

        sub.on("event", (event) => {
            const newEvent = new Event(event);
            newEvent.save();
        });
    } else if (retries > 20) {
        alert("Cannot establish Relay connection...");
        return;
    } else {
        setTimeout(() => {
            getEvents();
        }, 1000);
    }
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
