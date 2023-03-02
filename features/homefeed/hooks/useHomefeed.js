import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Note, relays } from "../../../utils/nostrV2";
import { pool } from "../../../utils/nostrV2/relayPool";

export const useHomefeed = (unixNow) => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState();
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

    const urls = relays.map((relay) => relay.url);

    // Setup pagination Function
    const setNewPage = (pageValue) => {
        setPage(pageValue);
    };

    const triggerRefresh = () => {
        setRefresh((prev) => !prev);
    };

    const eventCallback = useCallback((event) => {
        const newEvent = new Note(event);
        if (newEvent.checkRoot()) {
            const parsedEvent = newEvent.save();
            if (parsedEvent.root) {
                setData((prev) =>
                    [...prev, parsedEvent].sort(
                        (a, b) => b.created_at - a.created_at
                    )
                );
            }
        }
    }, []);

    useEffect(() => {
        const hoursInSeconds = 6 * 60 * 60;
        const until = Math.floor(unixNow - page * hoursInSeconds);
        const since = Math.floor(
            unixNow - hoursInSeconds - page * hoursInSeconds
        );
        let sub = pool.sub(urls, [
            {
                kinds: [1],
                authors: followedPubkeys,
                until: until,
                since: since,
            },
        ]);
        sub.on("event", eventCallback);
        // Unsub and clear interval on dismount
        return () => {
            // subs.forEach((sub) => sub.unsub());
        };
    }, [page, refresh]);

    return [data, page, setNewPage, triggerRefresh];
};
