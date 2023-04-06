import { Note } from "./Note";
import { connectedRelayPool, pool } from "./relayPool";

export const getEventById = async (eventIdInHex) => {
    const urls = connectedRelayPool.map((relay) => relay.url);
    const receivedEvent = await new Promise((resolve, reject) => {
        const sub = pool.sub(urls, [{ ids: [eventIdInHex] }], {
            skipVerification: true,
        });
        sub.on("event", (event) => {
            const newEvent = new Note(event).save();
            resolve(newEvent);
        });
        setTimeout(() => {
            reject();
        }, 3200);
    });
    return receivedEvent;
};
