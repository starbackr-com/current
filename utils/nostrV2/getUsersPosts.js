import { connectedRelays } from "./relay";
const allSettled = require('promise.allsettled');

export const getUsersPosts = async (pubkeyInHex) => {
    const posts = {}
    await allSettled(
        connectedRelays.map((relay) => new Promise((resolve, reject) => {
            let events = []
            let sub = relay.sub([
                {
                    authors: [pubkeyInHex],
                    kinds: [1],
                    limit: 50
                },
            ]);
            const timer = setTimeout(() => {
                resolve(events);
                return;
            }, 3000)
            sub.on("event", (event) => {
                events.push(event)
            });
            sub.on("eose", () => {
                clearTimeout(timer);
                sub.unsub();
                resolve(events);
                return;
            });
        }))
    ).then(result => result.map(result => result.value.map(post => {posts[post.id] = post})));
    return posts;
};
