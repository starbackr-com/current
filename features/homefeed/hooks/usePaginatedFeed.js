import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectedRelayPool, Note, pool } from "../../../utils/nostrV2";

export const usePaginatedFeed = (unixNow) => {
    const [events, setEvents] = useState([]);
    const [globalUntil, setGlobalUntil] = useState(
        Math.floor(Date.now() / 1000)
    );
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    let timer;

    let windowHours = 1;

    if (followedPubkeys < 100) {
        windowHours = 12;
    } else if (followedPubkeys < 250) {
        windowHours = 3;
    }

    const refresh = () => {
        setGlobalUntil(Math.floor(Date.now() / 1000));
        get25RootPosts();
    };

    // const get25RootPostsNew = async () => {
    //     const now = Math.floor(Date.now() / 1000);
    //     const relays = connectedRelayPool.map((relay) => {
    //         return Object.assign(relay, { lastItem: now });
    //     });
    //     const rootPosts = new Set();
    //     await Promise.allSettled(
    //         relays.map((relay) => {
    //             return new Promise(async (resolve) => {
    //                 while ([...rootPosts].length < 25) {
    //                     await new Promise((resolve) => {
    //                         const sub = relay.sub(
    //                             [
    //                                 {
    //                                     authors: followedPubkeys,
    //                                     kinds: [1],
    //                                     limit: 25,
    //                                     until: relay.lastItem,
    //                                 },
    //                             ],
    //                             { skipVerification: true }
    //                         );
    //                         sub.on("event", (event) => {
    //                             if (event.created_at > relay.lastItem) {
    //                                 relay.lastItem = event.created_at;
    //                             }
    //                             if (
    //                                 !event.tags.some((tag) => tag.includes("e"))
    //                             ) {
    //                                 const newEvent = new Note(event).save();
    //                                 rootPosts.add(newEvent);
    //                                 console.log(rootPosts.size);
    //                             }
    //                         });
    //                         sub.on("eose", () => {
    //                             resolve();
    //                         });
    //                     });
    //                 }
    //                 const deduped = new Set([...rootPosts, ...events]);
    //                 setEvents(
    //                     [...deduped].sort((a, b) => b.created_at - a.created_at)
    //                 );
    //                 resolve();
    //             });
    //         })
    //     );
    // };

    const get25RootPosts = async () => {
        if (followedPubkeys.length < 1) {
            return;
        }
        let until = globalUntil;
        let since = until - 3600;
        const urls = connectedRelayPool.map((relay) => relay.url);
        const results = [];
        while (results.length < 25) {
            await new Promise((resolve) => {
                const next = () => {
                    const set = new Set([...events, ...results]);
                    setEvents(
                        [...set].sort((a, b) => b.created_at - a.created_at)
                    );
                    resolve();
                    sub.unsub();
                };
                const sub = pool.sub(
                    urls,
                    [
                        {
                            authors: followedPubkeys,
                            kinds: [1],
                            until,
                            since,
                        },
                    ],
                    { skipVerification: true }
                );
                timer = setTimeout(next, 3200);
                sub.on("event", (event) => {
                    clearTimeout(timer);
                    if (!event.tags.some((tag) => tag.includes("e"))) {
                        const newEvent = new Note(event).save();
                        results.push(newEvent);
                    }
                    timer = setTimeout(next, 3000);
                });
            });
            until = until - 3600;
            since = since - 3600;
        }
        setGlobalUntil(until);
    };

    useEffect(() => {
        get25RootPosts();
    }, []);

    return [get25RootPosts, events, refresh];
};