import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectedRelayPool, Note, pool } from "../../../utils/nostrV2";

export const usePaginatedFeed = (unixNow) => {
    const [events, setEvents] = useState([]);
    const [globalUntil, setGlobalUntil] = useState(Math.floor(Date.now() / 1000));
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    let timer;

    let windowHours = 1;

    if (followedPubkeys < 100) {
        windowHours = 12
    } else if (followedPubkeys < 250) {
        windowHours = 3
    }

    const get25RootPosts = async () => {
        let until = globalUntil
        let since = until - 3600;
        const urls = connectedRelayPool.map((relay) => relay.url);
        const results = [];
        while (results.length < 25) {
            console.log(until)
            await new Promise((resolve) => {
                const next = () => {
                    const set = new Set([...events, ...results]);
                    setEvents(
                        [...set].sort((a, b) => b.created_at - a.created_at)
                    );
                    resolve();
                    sub.unsub();
                };
                const sub = pool.sub(urls, [
                    {
                        authors: followedPubkeys,
                        kinds: [1],
                        until,
                        since,
                    },
                ]);
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
            until = until - 3600
            since = since - 3600;
        }
        setGlobalUntil(until)
    };

    useEffect(() => {
        get25RootPosts();
    }, []);

    return [get25RootPosts, events];
};
