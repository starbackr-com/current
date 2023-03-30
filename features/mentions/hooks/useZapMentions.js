import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { connectedRelayPool, Note, pool } from "../../../utils/nostrV2";
import { Zap } from "../../zaps/Zap";

const useZapMentions = () => {
    const [data, setData] = useState([]);
    const pk = useSelector((state) => state.auth.pubKey);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    const receivedEventIds = [];

    const eventCallback = useCallback(
        (event) => {
            if (mutedPubkeys.includes(event.pubkey)) {
                return;
            } else {
                if (!receivedEventIds.includes(event.id) && event.pubkey != pk) {
                    receivedEventIds.push(event.id);
                    const newEvent = new Zap(event);
                    setData((prev) => [...prev, newEvent].sort((a, b) => b.created_at - a.created_at));
                }
            }
        },
        [mutedPubkeys]
    );

    useEffect(() => {
        const urls = connectedRelayPool.map((relay) => relay.url);
        const sub = pool.sub(urls, [
            {
                kinds: [9735],
                "#p": [pk],
            },
        ], {skipVerification: true});
        sub.on("event", eventCallback);
        return () => {
            sub.unsub();
        };
    }, []);

    return data;
};

export default useZapMentions;