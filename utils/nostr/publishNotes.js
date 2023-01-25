import { getPublicKey, getEventHash, signEvent } from "nostr-tools";
import { getValue } from "../secureStore";
import relay from "./initRelay";

export const publishKind0 = async (address, bio, imageUrl) => {
    if (relay.status === 1) {
        try {
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
            event.sig = signEvent(event, privKey);

            let pub = relay.publish(event);
            pub.on("ok", () => {
                alert(`${relay.url} has accepted our event`);
            });
            pub.on("seen", () => {
                console.log(`we saw the event on ${relay.url}`)
                console.log(pubKey)
            });
            pub.on("failed", (reason) => {
                console.log(`failed to publish to ${relay.url}: ${reason}`);
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        throw new Error("Not connected to a relay...");
    }
};
