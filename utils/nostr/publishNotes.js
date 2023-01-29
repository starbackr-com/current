import { getPublicKey, getEventHash, signEvent } from "nostr-tools";
import { getValue } from "../secureStore";
import relay from "./initRelay";

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
        }),
    };
    event.id = getEventHash(event);
    console.log(privKey)
    event.sig = signEvent(event, privKey);
    const promise = new Promise((resolve, reject) => {
        if (relay.status === 1) {
            try {
                let pub = relay.publish(event);
                pub.on("ok", () => {
                    resolve();
                });
                pub.on("failed", (reason) => {
                    reject(reason)
                });
            } catch (err) {
                reject(err)
            }
        } else {
            reject('Not connected to a relay...')
        }
    });
    return promise
};
