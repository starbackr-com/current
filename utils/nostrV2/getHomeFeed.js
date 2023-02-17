import { connectedRelays } from "./relay";
import { Event } from "./Event";

export const getHomeFeed = async (pubkeys) => {
    const allPosts = {};
    await Promise.allSettled(
        connectedRelays.map(
            (relay) =>
                new Promise((resolve, reject) => {
                    let posts = [];
                    let sub = relay.sub([
                        {
                            authors: pubkeys,
                            kinds: [1],
                            limit: 50,
                        },
                    ]);
                    const timer = setTimeout(() => {
                        resolve(posts);
                        return;
                    }, 5000);
                    sub.on("event", (event) => {
                        const newEvent = new Event(event);
                        newEvent.save();
                        posts.push(newEvent);
                    });
                    sub.on("eose", () => {
                        sub.unsub();
                        clearTimeout(timer);
                        resolve(posts);
                        return;
                    });
                })
        )
    ).then((result) =>
        result.map((result) =>
            result.value.map((event) => {
                allPosts[event.id] = event;
            })
        )
    );
    return allPosts;
};
