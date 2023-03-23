import { useEffect, useState } from "react";
import { connectedRelayPool, Note, pool } from "../utils/nostrV2";

export const usePaginatedPosts = (pubkeyHexArray) => {
    let mounted = true;
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [globalUntil, setGlobalUntil] = useState(
        Math.floor(Date.now() / 1000)
    );
    let timer;

    const get25Posts = async () => {
        setIsLoading(true);
        let loops = 0
        let until = globalUntil;
        let since = until - 7200;
        const urls = connectedRelayPool.map((relay) => relay.url);
        const results = [];
        while (results.length < 25 && loops < 10 && mounted) {
            loops++
            console.log(until);
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
                            authors: pubkeyHexArray,
                            kinds: [1],
                            until,
                            since,
                        },
                    ],
                    { skipVerification: true }
                );
                timer = setTimeout(next, 2000);
                sub.on("event", (event) => {
                    clearTimeout(timer);
                    const newEvent = new Note(event).save();
                    results.push(newEvent);
                    timer = setTimeout(next, 2000);
                });
            });
            until = until - 7200;
            since = since - 7200;
        }
        setGlobalUntil(until);
        setIsLoading(false);
    };

    useEffect(() => {
        get25Posts();
        return () => {mounted = false};
    }, []);

    return [get25Posts, events, isLoading];
};
