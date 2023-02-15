import { connectedRelays } from "./relay";
import { Reply } from "./Reply";

export const getReplies = async (parentIds) => {
    const replies = {}
    await Promise.allSettled(
        connectedRelays.map((relay) => new Promise((resolve, reject) => {
            let events = []
            let sub = relay.sub([
                {
                    kinds: [1],
                    '#e': parentIds
                },
            ]);
            sub.on("event", (event) => {
                const reply = new Reply(event)
                events.push(reply)
            });
            sub.on("eose", () => {
                sub.unsub();
                resolve(events);
            });
            setTimeout(() => {
                resolve(events)
            }, 10000)
        }))
    ).then(result => result.map(result => result.value.map(reply => {replies[reply.id] = reply})));
    return replies;
};
