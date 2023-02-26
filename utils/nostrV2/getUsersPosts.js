import { Event } from "./Event";
import { connectedRelays } from "./relay";

export const getUsersPosts = async (pubkeyInHex) => {
    const posts = {}
    await Promise.allSettled(
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
                const newEvent = new Event(event)
                const formatted = newEvent.save('return')
                events.push(formatted)
                console.log(formatted)
            });
            sub.on("eose", () => {
                clearTimeout(timer);
                sub.unsub();
                resolve(events);
                return;
            });
        }))
    ).then(result => result.map(result => result.value.map(post => {posts[post.id] = post})));
    console.log(posts)
    return posts;
};