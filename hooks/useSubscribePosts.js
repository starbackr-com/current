import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { connectedRelays, Note } from "../utils/nostrV2";

export const useSubscribePosts = (pubkeysinHex, unixNow) => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState({});
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    // Setup Pagination - Six hours per page

    const setNewPage = (pageValue) => {
        console.log("called!");
        console.log(pageValue);
        setPage(pageValue);
    };

    useEffect(() => {
        // Subscribe to latest 6 posts on mount, get another 6-h window when 'page' changes
        let hoursInSeconds = 6 * 60 * 60;
        let until = Math.floor(unixNow - page * hoursInSeconds);
        let since = Math.floor(
            unixNow - hoursInSeconds - page * hoursInSeconds
        );
        console.log(`Getting data from ${since} to ${until}`);
        let subs = connectedRelays.map((relay) => {
            let sub = relay.sub([
                {
                    kinds: [1],
                    authors: pubkeysinHex,
                    until: until,
                    since: since,
                },
            ]);
            // Save events in data object if they don't exist already
            sub.on("event", (event) => {
                if (mutedPubkeys.includes(event.pubkey)) {
                    return;
                } else {
                    if (event.kind === 1) {
                        const newEvent = new Note(event);
                        const parsedEvent = newEvent.save()
                        if (data[newEvent.id]) {
                            return;
                        } else {
                            setData((prev) =>
                                ({...prev, [parsedEvent.id]: parsedEvent})
                            );
                        }
                    }
                }
            });
            return sub;
        });

        // Unsub on Dismount
        return () => {
            subs.forEach((sub) => sub.unsub());
        };
    }, [page]);

    return [data, page, setNewPage];
};
