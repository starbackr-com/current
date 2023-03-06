import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { connectedRelays, Note, relays, urls } from "../../../utils/nostrV2";
import { connectedRelayPool, pool } from "../../../utils/nostrV2/relayPool";

export const useNoteMentions = () => {
    const [data, setData] = useState([]);
    const pk = useSelector((state) => state.auth.pubKey);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    const receivedEventIds = [];

    const eventCallback = useCallback(
        (event) => {
            if (mutedPubkeys.includes(event.pubkey)) {
                return;
            } else {
                if (!receivedEventIds.includes(event.id)) {
                    receivedEventIds.push(event.id);
                    const newEvent = new Note(event).save();
                    setData((prev) => [...prev, newEvent]);
                }
            }
        },
        [mutedPubkeys]
    );

    useEffect(() => {
        const urls = relays.map((relay) => relay.url);
        const sub = pool.sub(urls, [
            {
                kinds: [1],
                "#p": [pk],
            },
        ]);
        sub.on("event", eventCallback);
        sub.on("eose", () => {
            console.log("eose!");
        });
        return () => {
            sub.unsub();
        };
    }, []);

    return data;
};
