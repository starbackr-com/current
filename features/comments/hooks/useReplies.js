import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { connectedRelayPool, Note, pool } from "../../../utils/nostrV2";

export const useReplies = (eventId, now) => {
    const [replies, setReplies] = useState([]);
    const urls = connectedRelayPool.map((relay) => relay.url);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    const eventCallback = useCallback(
        (event) => {
            if (mutedPubkeys.includes(event.pubkey)) {
                return;
            } else {
                const newEvent = new Note(event).save();
                setReplies((prev) => [...prev, newEvent]);
            }
        },
        [mutedPubkeys]
    );

    useEffect(() => {
        const sub = pool.sub(urls, [
            {
                kinds: [1],
                "#e": [eventId],
            },
        ]);

        sub.on("event", eventCallback);
    }, []);
    return replies;
};
