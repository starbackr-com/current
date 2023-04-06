import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { connectedRelayPool, Note, pool } from "../../../utils/nostrV2";
import { Zap } from "../../zaps/Zap";

export const useReplies = (eventId, now) => {
    const [replies, setReplies] = useState([]);
    const urls = connectedRelayPool.map((relay) => relay.url);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    const eventCallback = useCallback(
        (event) => {
            if (mutedPubkeys.includes(event.pubkey)) {
                return;
            } else {
                if (event.kind === 1) {
                    const newEvent = new Note(event).saveReply();
                    setReplies((prev) => [...prev, newEvent].sort((a, b) => b.created_at - a.created_at));
                } else if (event.kind === 9735) {
                    const newZap = new Zap(event);
                    setReplies((prev) => [...prev, newZap].sort((a, b) => b.created_at - a.created_at));
                }
            }
        },
        [mutedPubkeys]
    );

    useEffect(() => {
        const sub = pool.sub(urls, [
            {
                kinds: [1, 9735],
                "#e": [eventId],
            },
        ]);

        sub.on("event", eventCallback);
    }, []);
    return replies;
};
