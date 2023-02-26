import { connectedRelays } from "./relay";
import { Event } from "./Event";

export const getHomeFeed = async (pubkeys, page) => {
    console.log(`Getting Data for ${pubkeys.length} keys...`)
    let now = new Date() / 1000;
    let hoursInSeconds = 2 * 60 * 60;
    let until = Math.floor(now - page * hoursInSeconds);
    let since = Math.floor(now - hoursInSeconds - (page * hoursInSeconds));
    console.log(`Getting events from ${since} to ${until}`)
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
                            until: until,
                            since: since,
                        },
                    ]);
                    const fn = () => {
                        sub.unsub();
                        console.log(`${relay.url} Timeout!`);
                        resolve(posts);
                        return;
                    };
                    const timer = setTimeout(() => fn(), 15000);
                    sub.on("event", (event) => {
                        const newEvent = new Event(event, relay.url);
                        newEvent.save();
                        posts.push(newEvent);
                    });
                    sub.on("eose", () => {
                        sub.unsub();
                        console.log(
                            `${relay.url} EOSE! Received: ${posts.length} posts`
                        );
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
