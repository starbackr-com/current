import {
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
} from "nostr-tools";

import { store } from "../store/store";
import { addMessage } from "../features/messagesSlice";
import { getValue } from "./secureStore";
import relay from "./nostr/initRelay";
import { Event } from "./nostr/Event";

export const getEvents = async (url, pubkeys) => {
    console.log(relay.status);

    setTimeout(() => {
        relay.on("error", () => {
            console.log(`failed to connect to ${relay.url}`);
        });

        let sub = relay.sub([
            {
                authors: [
                    "d307643547703537dfdef811c3dea96f1f9e84c8249e200353425924a9908cf8",
                ],
                limit: 25,
            },
            {
                authors: [
                    "d307643547703537dfdef811c3dea96f1f9e84c8249e200353425924a9908cf8",
                ],
                kinds: [0],
            },
        ]);

        sub.on("event", (event) => {
            if (event.kind === 1) {
                store.dispatch(addMessage({ event }));
            }
            if (event.kind === 0) {
                const newEvent = new Event(event);
                newEvent.save();
            }
        });
        sub.on("eose", () => {
            sub.unsub();
        });
    }, 5000);
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

        console.log(event);

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
