import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Note, pool, connectedRelayPool } from "../../../utils/nostrV2";

export const useHomefeed = (unixNow) => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState();
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    const ownPK = useSelector((state) => state.auth.pubKey);

    const receivedEventIds = new Set();

    const setNewPage = (pageValue) => {
        setPage(pageValue);
    };

    const triggerRefresh = () => {
        setPage(0);
        setRefresh((prev) => !prev);
    };

    const eventCallback = useCallback((event) => {
        if (!receivedEventIds.has(event.id)) {
            receivedEventIds.add(event.id);
            const newEvent = new Note(event);
            if (newEvent.checkRoot()) {
                const parsedEvent = newEvent.save();
                setData((prev) =>
                    [...prev, parsedEvent].sort(
                        (a, b) => b.created_at - a.created_at
                    )
                );
            }
        }
    }, []);

    useEffect(() => {
        const authorArray = new Set([...followedPubkeys, ownPK]);
        const hoursInSeconds = 6 * 60 * 60;
        const until = Math.floor(unixNow - page * hoursInSeconds);
        const since = Math.floor(
            unixNow - hoursInSeconds - page * hoursInSeconds
        );
        const urls = connectedRelayPool.map((relay) => relay.url);
        const sub = pool.sub(urls, [
            {
                kinds: [1],
                authors: [...authorArray],
                until: until,
                since: since,
            },
        ]);

        sub.on("event", eventCallback);
        return () => {
            sub.unsub();
        };
    }, [page, refresh, followedPubkeys]);

    return [data, page, setNewPage, triggerRefresh];
};
