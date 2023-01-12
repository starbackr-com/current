import {
    validateEvent,
    verifySignature,
    signEvent,
    getEventHash,
    getPublicKey,
} from "nostr-tools";
import { getValue } from "./secureStore";

export const createBasicEvent = async (content) => {
    try {
        const securePrivKey = await getValue("privKey");
        if (!securePrivKey) {
            throw new Error("No privatekey in Secure Storage");
        }
        let event = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: content,
            pubkey: getPublicKey(securePrivKey),
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, securePrivKey);

        let ok = validateEvent(event);
        let veryOk = verifySignature(event);
        if (!ok || !veryOk) {
            throw new Error("Could not verify event or signature!")
        }
    } catch (err) {
        console.log(err);
    }
};
