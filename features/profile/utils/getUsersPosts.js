import { connectedRelays } from "../../../utils/nostrV2";
import { ProfilePost } from "../ProfilePost";

export const getUsersPosts = async (pubkeyInHex) => {
    const posts = {}
    await Promise.allSettled(
        connectedRelays.map((relay) => new Promise((resolve, reject) => {
            let events = []
            let sub = relay.sub([
                {
                    authors: [pubkeyInHex],
                    kinds: [1],
                    limit: 100
                },
            ]);
            const timer = setTimeout(() => {
                resolve(events);
                return;
            }, 3000)
            sub.on("event", (event) => {
                const newEvent = new ProfilePost(event)
                const formatted = newEvent.saveNote()
                events.push(formatted)
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