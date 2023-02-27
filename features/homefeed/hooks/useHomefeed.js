import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectedRelays, Note } from "../../../utils/nostrV2";
import { connectedRelayPool, pool } from "../../../utils/nostrV2/relayPool";

export const useHomefeed = (unixNow) => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

    const receivedIds = [];
    const receivedEvents = [];

    // Setup pagination Function

    const setNewPage = (pageValue) => {
        setPage(pageValue);
    };

    useEffect(() => {
        // Subscribe to latest 6 posts on mount, get another 6-h window when 'page' changes
        const hoursInSeconds = 6 * 60 * 60;
        const until = Math.floor(unixNow - page * hoursInSeconds);
        const since = Math.floor(
            unixNow - hoursInSeconds - page * hoursInSeconds
        );
        console.log(connectedRelayPool)
        let sub = pool.sub(['wss://relay.current.fyi', 'wss://relay.nostrati.com', 'wss://nostr.mom', 'wss://nostr-pub.wellorder.net', 'wss://nos.lol', 'wss://nostr-verified.wellorder.net', 'wss://nostr.cro.social'], [
            {
                kinds: [1],
                authors: followedPubkeys,
                until: until,
                since: since,
            },
        ]);
        sub.on("event", (event) => {
            if (!receivedIds.includes(event.id)) {
                receivedIds.push(event.id);
                const newEvent = new Note(event);
                const parsedEvent = newEvent.save();
                if (parsedEvent.root) {
                    setData((prev) => [...prev, parsedEvent]);
                }
            }
        });
        // const subs = connectedRelays.map((relay) => {
        //     const sub = relay.sub([
        //         {
        //             kinds: [1],
        //             authors: followedPubkeys,
        //             until: until,
        //             since: since,
        //         },
        //     ]);
        //     // Save events in data object if they don't exist already
        //     sub.on("event", (event) => {
        //         if (!receivedIds.includes(event.id)) {
        //             receivedIds.push(event.id);
        //             const newEvent = new Note(event);
        //             const parsedEvent = newEvent.save();
        //             if (parsedEvent.root) {
        //                 setData((prev) => [...prev, parsedEvent]);
        //             }
        //         }
        //     });
        //     sub.on("eose", () => {
        //         sub.unsub();
        //     });
        //     return sub;
        // });

        // Unsub and clear interval on dismount
        return () => {
            // subs.forEach((sub) => sub.unsub());
        };
    }, [page]);

    return [data, page, setNewPage];
};
