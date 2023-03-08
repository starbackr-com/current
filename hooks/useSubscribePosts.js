import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { connectedRelayPool, Note, pool } from "../utils/nostrV2";

export const useSubscribePosts = (pubkeysinHex, unixNow) => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    // Setup Pagination - Six hours per page

    const setNewPage = (pageValue) => {
        console.log("called!");
        console.log(pageValue);
        setPage(pageValue);
    };

    const eventCallback = useCallback(
        (event) => {
            if (mutedPubkeys.includes(event.pubkey)) {
                return;
            } else {
                if (event.kind === 1) {
                    const newEvent = new Note(event);
                    const parsedEvent = newEvent.save();
                    setData((prev) => [...prev, parsedEvent].sort((a, b) => b.created_at - a.created_at));
                }
            }
        },
        [mutedPubkeys]
    );

    useEffect(() => {
        // Subscribe to latest 6 posts on mount, get another 6-h window when 'page' changes
        let hoursInSeconds = 24 * 60 * 60;
        let until = Math.floor(unixNow - page * hoursInSeconds);
        let since = Math.floor(
            unixNow - hoursInSeconds - page * hoursInSeconds
        );
        console.log(`Getting data from ${since} to ${until}`);
        const urls = connectedRelayPool.map((relay) => relay.url);
        const sub = pool.sub(urls, [
            {
                kinds: [1],
                authors: pubkeysinHex,
                until: until,
                since: since,
            },
        ]);
        sub.on("event", eventCallback);
        // Unsub on Dismount
        return () => {
            sub.unsub();
        };
    }, [page]);

    return [data, page, setNewPage];
};
