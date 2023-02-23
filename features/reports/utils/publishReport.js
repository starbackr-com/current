import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { connectedRelays } from "../../../utils/nostrV2";
import { getValue } from "../../../utils/secureStore";

export const publishReport = async (reason, eventId, pubkeyInHex) => {
    try {
        const sk = await getValue("privKey");
        if (!sk) {
            throw new Error("No privKey in secure storage found");
        }
        let pk = getPublicKey(sk);
        let event = {
            kind: 1984,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ["e", eventId, reason],
                ["p", pubkeyInHex],
            ],
            content: "",
        };

        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);
        const successes = await Promise.allSettled(
            connectedRelays.map((relay) => {
                return new Promise((resolve, reject) => {
                    let pub = relay.publish(event);
                    const timer = setTimeout(() => {
                        reject();
                    }, 5000);
                    pub.on("ok", () => {
                        clearTimeout(timer);
                        resolve(relay.url);
                        return;
                    });
                    pub.on("failed", (error) => {
                        console.log(error);
                        clearTimeout(timer);
                        reject();
                        return;
                    });
                });
            })
        ).then((result) =>
            result
                .filter((promise) => promise.status === "fulfilled")
                .map((promise) => promise.value)
        );
        return successes;
    } catch (error) {
        console.log(error);
    }
};
