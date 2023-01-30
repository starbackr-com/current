import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { getValue } from "../secureStore";
import { connectedRelays } from "./initRelays";

export const publishKind0 = async (address, bio, imageUrl) => {
    const username = address.split("@")[0];
    let privKey = await getValue("privKey");
    if (!privKey) {
        throw new Error("No privKey in secure storage found");
    }
    let pubKey = getPublicKey(privKey);
    let event = {
        kind: 0,
        pubkey: pubKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify({
            name: username,
            nip05: address,
            about: bio,
            picture: imageUrl,
            lud16: address,
        }),
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privKey);
    const successes = await Promise.allSettled(
        connectedRelays.map((relay) => {
            return new Promise((resolve, reject) => {
                let pub = relay.publish(event);
                pub.on("ok", () => {
                    resolve(relay.url);
                });
                pub.on("failed", () => {
                    reject();
                });
                setTimeout(() => {
                    reject();
                }, 10000)
            });
        })
    );

    return successes
        .filter((promise) => promise.status === "fulfilled")
        .map((promise) => promise.value);
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
